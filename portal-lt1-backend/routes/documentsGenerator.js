const express = require('express');
const { faker } = require('@faker-js/faker');
const store = require('../data/documentStore');
const { allowedStatuses, validateDocument } = require('../validation/documentValidation');
const { requireAuth } = require('../middleware/auth');
const hub = require('../realtime/wsHub');

const router = express.Router();

let timer = null;
let state = {
  running: false,
  intervalMs: 3000,
  batchSize: 1,
  lastStartedAt: null,
  lastStoppedAt: null,
  createdTotal: 0
};

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function randomSchoolDate() {
  // Bias towards current school year-like dates.
  const now = new Date();
  const start = new Date(now.getFullYear() - 1, 8, 1); // Sep 1 last year
  const end = new Date(now.getFullYear(), 6, 31); // Jul 31 this year
  return faker.date.between({ from: start, to: end });
}

function generateValidDocument() {
  const category = pick(['Regulamente', 'Proceduri', 'Examene', 'Orar', 'Anunturi', 'Financiar', 'Administrativ']);
  const issuer = pick([
    'Secretariat',
    'Director',
    'Director adjunct',
    'Consiliul profesoral',
    'Consiliul de administratie',
    'Comisia de evaluare',
    'Comisia de burse',
    'Cabinet psihopedagogic',
    'Catedra de informatica',
    'Catedra de matematica'
  ]);
  const issuedAt = toIsoDate(randomSchoolDate());

  const titleTemplates = {
    Regulamente: [
      'Regulament intern elevi {year}',
      'Regulament privind conduita si prezenta {year}',
      'Regulament pentru folosirea laboratorului de informatica'
    ],
    Proceduri: [
      'Procedura inscriere clasa a IX-a',
      'Procedura transfer elevi',
      'Procedura eliberare adeverinte'
    ],
    Examene: [
      'Calendar evaluari semestriale {year}',
      'Programare simulare Bacalaureat {year}',
      'Procedura desfasurare teze {year}'
    ],
    Orar: ['Orar semestrul I {year}', 'Orar semestrul II {year}', 'Orar consultatii profesori {year}'],
    Anunturi: [
      'Anunt sedinta cu parintii {date}',
      'Anunt inscrieri activitati extracurriculare',
      'Anunt burse sociale {year}'
    ],
    Financiar: ['Lista burse {year}', 'Plata taxe examinare {year}', 'Situatie fonduri clasa {year}'],
    Administrativ: ['Plan securitate date elevi', 'Proces verbal sedinta CA {date}', 'Decizie interna {date}']
  };

  const year = String(new Date(issuedAt).getFullYear());
  const dateLabel = issuedAt;

  const rawTitle = pick(titleTemplates[category] || ['Document administrativ {date}'])
    .replace('{year}', year)
    .replace('{date}', dateLabel);

  const descriptionTemplates = {
    Regulamente: `Reguli actualizate privind conduita, prezenta si evaluarea elevilor in anul scolar ${year}. Documentul se aplica tuturor claselor si intra in vigoare la data emiterii.`,
    Proceduri:
      'Pasii necesari, documentele solicitate si termenele limita. Include responsabilitati pentru elevi, parinti si secretariat.',
    Examene:
      'Informatii despre calendar, sali, intervale orare si reguli de desfasurare. Prezentarea la timp si actul de identitate sunt obligatorii.',
    Orar: 'Programul orelor pe zile si intervale orare. Eventualele modificari sunt anuntate prin secretariat.',
    Anunturi: 'Anunt oficial pentru elevi si parinti. Consultati avizierul si platforma pentru actualizari.',
    Financiar: 'Informatii privind bursele/taxele si conditiile de acordare. Pentru detalii, contactati secretariatul.',
    Administrativ:
      'Document intern cu masuri administrative si instructiuni. Se distribuie personalului relevant si se arhiveaza conform procedurilor.'
  };

  const status = faker.helpers.weightedArrayElement([
    { weight: 7, value: 'Activ' },
    { weight: 2, value: 'Revizie' },
    { weight: 1, value: 'Arhivat' }
  ]);

  const payload = {
    title: String(rawTitle).slice(0, 120),
    category,
    issuer: String(issuer).slice(0, 80),
    issuedAt,
    status: allowedStatuses.includes(status) ? status : 'Activ',
    description: String(descriptionTemplates[category] || descriptionTemplates.Administrativ).slice(0, 1000)
  };

  const { errors, sanitized } = validateDocument(payload);
  if (Object.keys(errors).length > 0) {
    // Fallback - should be extremely rare, but keep generator resilient.
    return {
      title: 'Document generat',
      category: 'Administrativ',
      issuer: 'Generator',
      issuedAt: new Date().toISOString().slice(0, 10),
      status: 'Activ',
      description: 'Document generat automat.'
    };
  }

  return sanitized;
}

function tick() {
  const created = [];
  for (let i = 0; i < state.batchSize; i += 1) {
    created.push(store.createDocument(generateValidDocument()));
  }
  state.createdTotal += created.length;
  hub.broadcast({ type: 'documents_batch_added', count: created.length, ids: created.map((d) => d.id) });
}

router.post('/start', requireAuth, function (req, res) {
  const batchSizeRaw = req.body?.batchSize;
  const intervalMsRaw = req.body?.intervalMs;

  const batchSize = Number.parseInt(batchSizeRaw ?? state.batchSize, 10);
  const intervalMs = Number.parseInt(intervalMsRaw ?? state.intervalMs, 10);
  const errors = {};

  if (Number.isNaN(batchSize) || batchSize < 1 || batchSize > 50) {
    errors.batchSize = 'batchSize trebuie sa fie intre 1 si 50.';
  }
  if (Number.isNaN(intervalMs) || intervalMs < 250 || intervalMs > 60000) {
    errors.intervalMs = 'intervalMs trebuie sa fie intre 250 si 60000.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Parametri invalidi pentru generator.', errors });
  }

  state.batchSize = batchSize;
  state.intervalMs = intervalMs;

  if (timer) clearInterval(timer);
  timer = setInterval(tick, state.intervalMs);
  state.running = true;
  state.lastStartedAt = new Date().toISOString();

  return res.json({ ...state });
});

router.post('/stop', requireAuth, function (req, res) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  state.running = false;
  state.lastStoppedAt = new Date().toISOString();
  return res.json({ ...state });
});

router.get('/status', requireAuth, function (req, res) {
  return res.json({ ...state });
});

module.exports = router;

