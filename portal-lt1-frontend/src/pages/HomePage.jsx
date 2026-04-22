import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Raport Elevi-Profesor', value: '10:1' },
  { label: 'Rata de Angajare', value: '81%' },
  { label: 'Ani de Traditie si Excelenta', value: '>150' },
  { label: 'Specializari si Calificari Profesionale', value: '+5' },
];

const events = [
  {
    date: 'Sam, 24 Feb',
    text: 'Ziua Portilor Deschise / Tur ghidat al atelierelor si laboratoarelor pentru viitorii elevi.',
    cta: 'DETALII EVENIMENT',
  },
  {
    date: 'Joi, 14 Mar',
    text: 'Targul Ofertelor Educationale / Prezentarea profilurilor tehnologice pentru absolventii de clasa a VIII-a.',
    cta: 'VEZI PROGRAMUL',
  },
  {
    date: 'Lun, 15 Apr',
    text: 'Concursul Regional de Robotica si Mecanica Fina / Editia a X-a, gazduit in sala de festivitati.',
    cta: 'INSCRIE ECHIPA',
  },
  {
    date: 'Vin, 26 Apr',
    text: 'Saptamana "Scoala Altfel" / Activitati extracurriculare si vizite la parteneri economici.',
    cta: 'VEZI ACTIVITATILE',
  },
];

const gallery = [
  '/assets/antet2@4x.png',
  '/assets/poza_liceu.jpeg',
  '/assets/antet2@4x.png',
  '/assets/poza_liceu.jpeg',
];

const heroTitleLines = ['LICEUL', 'TEHNOLOGIC', 'NR. 1'];

const createInitialBinaryLines = () => heroTitleLines.map((line) => line.replace(/\S/g, '0'));

const parseCounterTarget = (value) => {
  if (value.includes(':')) {
    const [mainValue, ...rest] = value.split(':');
    return {
      target: Number.parseInt(mainValue.replace(/\D/g, ''), 10) || 0,
      prefix: '',
      suffix: rest.length > 0 ? `:${rest.join(':')}` : '',
    };
  }

  const numericPart = Number.parseInt(value.replace(/\D/g, ''), 10) || 0;
  const prefixMatch = value.match(/^[^\d]+/);
  const suffixMatch = value.match(/[^\d]+$/);

  return {
    target: numericPart,
    prefix: prefixMatch ? prefixMatch[0] : '',
    suffix: suffixMatch ? suffixMatch[0] : '',
  };
};

const formatCounterValue = (meta, current) => `${meta.prefix}${current}${meta.suffix}`;

function HomePage() {
  const statMeta = useMemo(() => stats.map((item) => parseCounterTarget(item.value)), []);
  const [binaryTitleLines, setBinaryTitleLines] = useState(() => createInitialBinaryLines());
  const [displayStatValues, setDisplayStatValues] = useState(() => statMeta.map(() => '0'));

  useEffect(() => {
    const startDelay = 1500;
    const duration = 920;
    const baseLines = heroTitleLines.map((line) => line.split(''));
    const totalChars = baseLines.reduce((count, line) => count + line.filter((char) => char !== ' ').length, 0);
    const tickMs = 58;
    let intervalId;

    const startTimer = window.setTimeout(() => {
      const startTime = Date.now();

      intervalId = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        let processedChars = 0;
        const nextLines = baseLines.map((line) =>
          line.map((char) => {
            if (char === ' ') {
              return ' ';
            }

            const threshold = (processedChars / Math.max(totalChars - 1, 1)) * 0.82;
            processedChars += 1;

            if (progress < threshold) {
              return Math.random() > 0.5 ? '1' : '0';
            }

            if (char === '1' && progress < threshold + 0.09) {
              return '0';
            }

            return char;
          })
        );

        setBinaryTitleLines(nextLines.map((line) => line.join('')));

        if (progress >= 1) {
          window.clearInterval(intervalId);
          setBinaryTitleLines(heroTitleLines);
        }
      }, tickMs);
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    const startDelay = 2500;
    const duration = 760;
    const tickMs = 72;
    let intervalId;

    const startTimer = window.setTimeout(() => {
      const startTime = Date.now();

      intervalId = window.setInterval(() => {
        const progress = Math.min((Date.now() - startTime) / duration, 1);

        if (progress >= 1) {
          window.clearInterval(intervalId);
          setDisplayStatValues(stats.map((item) => item.value));
          return;
        }

        setDisplayStatValues(
          statMeta.map((meta) => {
            const randomValue = Math.max(0, Math.floor(Math.random() * (meta.target + 14)));
            return formatCounterValue(meta, randomValue);
          })
        );
      }, tickMs);
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [statMeta]);

  return (
    <section className="page-shell home-page intro-sequence">
      <article className="home-hero">
        <img src="/assets/poza_liceu.jpeg" alt="Liceul Tehnologic Nr. 1" className="home-hero-image" />

        <div className="home-hero-overlay">
          <h1 aria-label={heroTitleLines.join(' ')}>
            {binaryTitleLines.map((line, lineIndex) => (
              <span key={`line-${lineIndex}`} className="home-hero-title-line" aria-hidden="true">
                {line.split('').map((character, characterIndex) => {
                  const finalCharacter = heroTitleLines[lineIndex][characterIndex];
                  const charKey = `${lineIndex}-${characterIndex}-${finalCharacter}`;
                  const className = `home-hero-letter${character !== finalCharacter ? ' is-binary' : ''}`;

                  return (
                    <span key={charKey} className={className}>
                      {character}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>
        </div>

        <div className="home-hero-banner">
          <span>START ADMITERE 2026: INVATA O MESERIE DE VIITOR!</span>
        </div>
      </article>

      <section className="home-intro">
        <article className="home-intro-story">
          <h2>DE CE SA ALEGI LICEUL TEHNOLOGIC NR. 1?</h2>
          <p>
            Cu o traditie ce incepe in 1873, Liceul Tehnologic Nr. 1 din Campulung Moldovenesc imbina
            educatia teoretica de calitate cu o pregatire practica esentiala pentru piata muncii.
            Oferim elevilor nostri laboratoare moderne, parteneriate solide cu agenti economici locali
            si oportunitatea de a dobandi calificari profesionale recunoscute.
          </p>
        </article>

        <div className="home-intro-links">
          <Link to="/documente" className="home-intro-link is-gold">
            <span>01.</span>
            <strong>STATISTICI LICEU</strong>
          </Link>
          <Link to="/calendar" className="home-intro-link is-light">
            <span>02.</span>
            <strong>EVENIMENTE VIITOARE</strong>
          </Link>
          <Link to="/despre-noi" className="home-intro-link is-purple">
            <span>03.</span>
            <strong>ALBUM FOTO</strong>
          </Link>
        </div>
      </section>

      <section className="home-stats" aria-label="Statistici liceu">
        {stats.map((item, index) => (
          <article key={item.label} className="home-stat-card">
            <p>{item.label}</p>
            <strong>{displayStatValues[index]}</strong>
          </article>
        ))}
      </section>

      <section className="home-events">
        <h2>EVENIMENTE VIITOARE IN SCOALA NOASTRA</h2>

        <div className="home-events-grid">
          <div className="home-events-list">
            {events.map((event) => (
              <article key={event.date} className="home-event-item">
                <p className="home-event-date">{event.date}</p>
                <p className="home-event-text">{event.text}</p>
              </article>
            ))}
          </div>

          <div className="home-events-actions">
            {events.map((event) => (
              <button key={event.cta} type="button" className="home-event-btn">
                {event.cta}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-gallery" aria-label="Album foto">
        <h2>ALBUM FOTO</h2>
        <div className="home-gallery-grid">
          {gallery.map((imagePath, index) => (
            <figure key={`${imagePath}-${index}`} className="home-gallery-item">
              <img src={imagePath} alt={`Galerie liceu ${index + 1}`} />
            </figure>
          ))}
        </div>
      </section>

    </section>
  );
}

export default HomePage;
