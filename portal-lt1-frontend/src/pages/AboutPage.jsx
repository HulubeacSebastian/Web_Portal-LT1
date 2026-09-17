import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { hasAuthSession } from '../utils/authSession';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);
const cresaPhotoUrl = (filename) => encodeURI(`/assets/Poze_cresa/${filename}`);

const timeline = [
  {
    year: '1873',
    title: 'Inceputurile invatamantului profesional',
    text: 'Institutie cu traditie tehnica, cu radacini in invatamantul profesional din Bucovina.',
  },
  {
    year: '1921–1948',
    title: 'Consolidare si reorganizare',
    text: 'In 1921, institutia devine „Scoala de Constructii de Lucrari Publice”. Intre 1925–1931 functioneaza ca „Scoala de Conductori Arhitecti”, iar intre 1931–1936 ca „Scoala de Constructii si Desenatori de Arhitectura” (durata 5 ani). In perioada 1936–1948 poarta denumirea „Liceul Industrial de Constructii Civile si Edilitare”.',
  },
  {
    year: '1944–1945',
    title: 'Relocare in contextul razboiului',
    text: 'Din cauza razboiului, scoala se muta de la Cernauti la Strehaia (jud. Mehedinti) in 1944, iar in 1945 isi stabileste activitatea la Campulung Moldovenesc.',
  },
  {
    year: '1950–1974',
    title: 'Invatamant tehnic si profesional',
    text: 'Dupa reforma invatamantului din 1948, incepand cu 1950 scoala functioneaza ca „Scoala Medie Tehnica de Constructii Civile si Industriale”. In 1955, in baza H.C.M. 247 (24 februarie 1955) si a Ordinului 366 (martie 1955), este repartizata in subordinea Trustului de Constructii Iasi si devine „Scoala Profesionala de Ucenici – Constructii”, cu durata de 3 ani, avand ca for tutelar Ministerul Constructiilor. Sub aceasta denumire functioneaza neintrerupt pana in 1974.',
  },
  {
    year: '1974',
    title: 'Transformare in grup scolar',
    text: 'Prin Ordin al Ministrului Constructiilor Industriale nr. 592/D din 24 mai 1974, „Scoala Profesionala de Ucenici – Constructii” din Campulung Moldovenesc se transforma in „Grupul Scolar de Constructii Campulung Moldovenesc”, devenind baza actualului Grup Scolar nr. 1.',
  },
  {
    year: '2012–prezent',
    title: 'Liceul Tehnologic Nr. 1',
    text: 'Modernizare, diversificarea programelor si orientare spre formare profesionala de calitate.',
  },
];

const archivePhotos = [
  {
    src: '/assets/istoric/scoala-arte-meserii-facada.jpg',
    alt: 'Fotografie de arhivă a clădirii Școlii de Arte și Meserii din Câmpulung Moldovenesc, cu un grup de bărbați în fața gardului',
    era: 'Arhivă',
    title: 'Școala de Arte și Meserii',
    text: 'Clădirea de altădată a școlii, în Câmpulung Moldovenesc — precursoarea instituțională a formării tehnice de azi.'
  },
  {
    src: '/assets/istoric/scoala-arte-meserii-1941.jpg',
    alt: 'Fotografie de arhivă din 1941 a clădirii Școlii de Arte și Meserii, iarna, acoperită de zăpadă',
    era: '1941',
    title: 'La început de război',
    text: 'Aceeași clădire, iarna anului 1941 — cu puțin timp înainte ca războiul să schimbe cursul școlii.'
  },
  {
    src: '/assets/istoric/scoala-arte-meserii-bombardata.jpg',
    alt: 'Fotografie de arhivă a clădirii Școlii de Arte și Meserii distruse de bombardamente în timpul celui de-al Doilea Război Mondial',
    era: 'Război',
    title: 'Școala, bombardată',
    text: 'Urmările războiului asupra clădirii — momentul care a impus relocarea activității școlare din 1944–1945.'
  }
];

const pillars = [
  {
    icon: '01',
    title: 'Misiune',
    text: 'Formam tineri competenti, responsabili si adaptati societatii moderne, imbinand teoria cu deprinderile practice si valorile morale.',
  },
  {
    icon: '02',
    title: 'Viziune',
    text: 'O scoala deschisa, moderna si incluziva, un centru de formare profesionala care pregateste elevii pentru viata si o cariera solida in societatea digitala si europeana.',
  },
  {
    icon: '03',
    title: 'Valori fundamentale',
    text: 'Respect, educatie, profesionalism, echilibru, comunitate si toleranta — reperele care ne ghideaza deciziile si relatiile din scoala.',
  },
];

const highlights = [
  'Invatare aplicata si calificari relevante pentru piata muncii',
  'Activitati educationale si extracurriculare care dezvolta aptitudini reale',
  'Proiecte, concursuri si initiative care intaresc comunitatea scolara',
];

const schoolNoua = [
  {
    icon: '🧰',
    title: 'Meserii cautate',
    text: 'Calificari relevante si competente aplicate, conectate la nevoile pietei muncii.',
  },
  {
    icon: '🚀',
    title: 'Angajare',
    text: 'Pregatire practica orientata spre integrare profesionala, inca din timpul liceului.',
  },
  {
    icon: '👩‍🏫',
    title: 'Cadre didactice',
    text: 'Profesori experimentati, implicati si preocupati de progresul fiecarui elev.',
  },
  {
    icon: '🏫',
    title: 'Sali de clasa',
    text: 'Spatii de invatare la standarde europene, pentru un cadru modern si sigur.',
  },
  {
    icon: '🔬',
    title: 'Laboratoare',
    text: 'Dotari si tehnologii actuale pentru invatare aplicata in ateliere si laboratoare.',
  },
];

const galleryFilters = ['Toate', 'Liceu', 'Creșă'];

const GALLERY_PHOTOS = [
  "fatada-scoala.jpeg",
  "WhatsApp Image 2026-09-16 at 15.50.44 (3).jpeg",
  "WhatsApp Image 2026-09-16 at 15.44.07.jpeg",
  "WhatsApp Image 2026-09-16 at 15.44.08.jpeg",
  "WhatsApp Image 2026-09-16 at 15.49.29.jpeg",
  "WhatsApp Image 2026-09-16 at 15.56.53 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 15.56.53.jpeg",
  "WhatsApp Image 2026-ss05-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-s05-26 at 21.17.22.jpeg",
  "WhatsApps Image 2026-05-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05s-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.21.jpeg",
  "WhatsApp Image 2026-09-16 at 15.j49.31.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (7).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (8).jpeg",
  "WhatsApp Image 2026-09-16 at 15.49.31.jpeg",
  "clasa-tematica.jpeg",
  "WhatsApp Image 2026-09-16 at 15.44n.08.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56.jpeg",
  "WhatsApp Image 2026-09-16 at 22.40.36 (3).jpeg",
  "WhatsApp Image 2026-09-16 at 22.40.36 (4).jpeg",
  "WhatsApp Image 2026-09-16 at 22.40.36 (5).jpeg",
  "WhatsApp Image 2026-09-16 at 22.40.36 (6).jpeg",
  "WhatsApp Image 2026-09-16 at 15.44.09.jpeg",
  "WhatsApp Image 2026-09-16 at 1n5.44.09.jpeg",
  "WhatsApp Image 2026-09-16 at 15.53.31 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 15.53.31.jpeg",
  "WhatsApp Image 2026-09-16 at 15.56.53 (2).jpeg",
  "WhatsApp Image 2026-09-16 at 15.56.53 (3).jpeg",
  "WhatsApp Image 2026-09-16 at 1j5.49.31.jpeg",
  "WhatsApp Image 2026-09-16 at 1j5.49.30.jpeg",
  "WhatsApp Image 2026-09-16 at 15.50.43.jpeg",
  "WhatsApp Image 2026-09-16 at 15.50.44 (1).jpeg",
  "WhatsApp Image 2026-09-16 at 15.50.44.jpeg",
  "WhatsApp Image 2026-09-16 at 15.52.31.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (6).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.06.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07.jpeg",
  "WhatsApp Image 2026-05-2s6 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05-26 ats 21.17.23.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17.jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.18.jpeg",
  "WhatsApp Image 202ss-05-26 at 21.12.34.jpeg",
  "WhatsApp Image 2026-05-26 at 2ss1.12.34.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.55.jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.22 (1).jpeg",
  "WhatsssApp Image 2026-05-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05-26ss at 21.12.34.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.12.34.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21.jpeg",
  "WhatsApp Image 2026-05-26 at 21.15.17.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23.jpeg"
];

const CRESA_PHOTOS = [
  'cresa-01.jpg',
  'cresa-02.jpg',
  'cresa-03.jpg',
  'cresa-04.jpg',
  'cresa-05.jpg',
  'cresa-06.jpg',
  'cresa-07.jpg',
  'cresa-08.jpg',
  'cresa-09.jpg',
  'cresa-10.jpg',
  'cresa-11.jpg',
  'cresa-12.jpg',
  'cresa-13.jpg',
  'cresa-14.jpg',
  'cresa-15.jpg'
];

const galleryItems = [
  ...GALLERY_PHOTOS.map((filename) => ({
    src: photoUrl(filename),
    alt: filename.replace(/\.(jpe?g|png|webp)$/i, ''),
    category: 'Liceu'
  })),
  ...CRESA_PHOTOS.map((filename) => ({
    src: cresaPhotoUrl(filename),
    alt: 'Creșă — spații de joacă și odihnă pentru cei mici',
    category: 'Creșă'
  }))
];

function AboutSectionHead({ eyebrow, title, lead }) {
  return (
    <header className="about-section-head">
      <span className="about-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {lead ? <p className="about-section-lead">{lead}</p> : null}
    </header>
  );
}

function AboutPage() {
  const location = useLocation();
  const [activeFilter, setActiveFilter] = useState('Toate');
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const target = document.querySelector(location.hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.hash]);

  const filteredGallery = useMemo(() => {
    if (activeFilter === 'Toate') {
      return galleryItems;
    }
    return galleryItems.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (!lightboxImage) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxImage(null);
      }
    };

    document.documentElement.classList.add('modal-open');
    document.body.classList.add('modal-open');
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxImage]);

  return (
    <section className="page-shell about-page">
      <header className="about-hero" aria-labelledby="about-hero-title">
        <img
          src={photoUrl('WhatsApp Image 2026-05-26 at 21.09.47.jpeg')}
          alt=""
          className="about-hero-media"
          aria-hidden="true"
        />
        <div className="about-hero-scrim" aria-hidden="true" />

        <div className="about-hero-content">
          <span className="about-hero-badge">Institutie de invatamant profesional si tehnic</span>
          <h1 id="about-hero-title">
            Despre <span>Liceul Tehnologic Nr. 1</span>
          </h1>
          <p className="about-hero-lead">
            Din 1873, formam specialisti pregatiti pentru piata muncii si pentru continuarea studiilor
            tehnice — in Campulung Moldovenesc.
          </p>
          <div className="about-hero-chips" aria-hidden="true">
            <span>Practica</span>
            <span>Parteneriate</span>
            <span>Performanta</span>
          </div>
        </div>
      </header>

      <div className="about-body">
        <section className="about-heritage about-reveal" aria-label="Traditie si identitate">
          <div className="about-heritage-inner">
            <div className="about-heritage-copy">
              <AboutSectionHead
                eyebrow="Traditie"
                title="Cea mai veche institutie de invatamant din Campulung Moldovenesc"
                lead="Din 1873, construim educatie tehnica prin munca, disciplina si respect pentru comunitate."
              />

              <div className="about-heritage-badges" aria-label="Repere de traditie">
                <span className="about-heritage-badge">
                  <strong>153</strong>
                  <em>ani</em>
                </span>
                <span className="about-heritage-badge is-gold">
                  <strong>1873–2026</strong>
                  <em>repere</em>
                </span>
              </div>

              <div className="about-heritage-origin" aria-label="Origini 1873">
                <p className="about-heritage-quote">
                  In 1873, la Cernauti — capitala Bucovinei — a luat fiinta „Inalt cezaro-craiasca scoala
                  profesionala de stat”, prima scoala de acest gen din Bucovina.
                </p>
                <ul className="about-heritage-points">
                  <li>
                    <strong>Constructii</strong> — pregatire pentru lucrari publice: cladiri, sosele, poduri si
                    infrastructura.
                  </li>
                  <li>
                    <strong>Chimie</strong> — formare tehnica pentru nevoile economice ale vremii.
                  </li>
                </ul>
              </div>
            </div>

            <aside className="about-heritage-aside" aria-label="Mesaj cheie">
              <p>
                O scoala care a crescut odata cu orasul — de la primele forme de invatamant profesional,
                pana la programe moderne, laboratoare si formare relevanta pentru societatea de azi.
              </p>
            </aside>
          </div>
        </section>

        <section className="about-story about-reveal" id="cine-suntem">
          <div className="about-story-visual">
            <img
              src={encodeURI('/assets/poza_liceu_1873.png')}
              alt="Spatii de lucru la liceu"
              loading="lazy"
            />
            <div className="about-story-visual-badge">
              <strong>1873</strong>
              <span>Traditie tehnica</span>
            </div>
          </div>

          <div className="about-story-copy">
            <AboutSectionHead eyebrow="Identitate" title="Cine suntem" />
            <p>
              Liceul Tehnologic Nr. 1 are o istorie bogata si ramane un punct de referinta pentru educatia
              tehnica din zona noastra. De-a lungul timpului, institutia a evoluat si s-a adaptat
              schimbarilor din societate si din domeniul tehnic, pastrand focusul pe formarea de competente
              utile si durabile.
            </p>
            <p>
              Astazi, ne asumam rolul de a pregati elevii pentru integrare directa pe piata muncii si
              pentru continuarea studiilor. Programele noastre urmaresc dezvoltarea aptitudinilor
              academice, profesionale, socio-emotionale si de colaborare, pentru ca fiecare elev sa isi
              construiasca un parcurs solid.
            </p>
            <ul className="about-story-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about-school-new about-reveal" aria-label="Scoala noua">
          <AboutSectionHead
            eyebrow="Directii"
            title="Școală nouă"
            lead="O scoala moderna, orientata spre practica, performanta si oportunitati reale pentru elevi."
          />
          <div className="about-school-bulb" role="img" aria-label="Scoala noua: beneficii si directii">
            <div className="about-school-bulb-center" aria-hidden="true">
              <span className="about-school-bulb-title">ȘCOALĂ NOUĂ</span>
              <span className="about-school-bulb-glow" />
              <span className="about-school-bulb-base" />
            </div>

            <ol className="about-school-bulb-slices" aria-label="Directii Scoala noua">
              {schoolNoua.map((item, index) => (
                <li
                  key={item.title}
                  className="about-school-bulb-slice"
                  style={{ '--slice-index': index }}
                >
                  <span className="about-school-bulb-slice-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <strong className="about-school-bulb-slice-title">{item.title}</strong>
                  <span className="about-school-bulb-slice-text">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="about-timeline-wrap about-reveal" id="istoric">
          <AboutSectionHead
            eyebrow="Evolutie"
            title="Istoricul nostru"
            lead="Repere care arata cum am crescut impreuna cu comunitatea locala."
          />
          <ol className="about-timeline-track">
            {timeline.map((item, index) => (
              <li key={item.year} className="about-timeline-entry">
                <div className="about-timeline-marker" aria-hidden="true">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <article className="about-timeline-card">
                  <time dateTime={item.year.replace(/[^0-9-]/g, '')}>{item.year}</time>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-archive about-reveal" id="arhiva-foto">
          <AboutSectionHead
            eyebrow="Fotografii de arhivă"
            title="Cum arăta școala în trecut"
            lead="Imagini de arhivă cu clădirea Școlii de Arte și Meserii — de la anii de dinainte de război, până la urmările pe care le-a lăsat asupra ei."
          />
          <div className="about-archive-grid">
            {archivePhotos.map((photo) => (
              <figure key={photo.src} className="about-archive-card">
                <div className="about-archive-media">
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                  <span className="about-archive-badge">{photo.era}</span>
                </div>
                <figcaption>
                  <h3>{photo.title}</h3>
                  <p>{photo.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="about-principles about-reveal" id="misiune">
          <AboutSectionHead
            eyebrow="Fundamente"
            title="Misiune, viziune si valori"
            lead="Principiile care ne ghideaza deciziile educationale in fiecare an scolar."
          />
          <div className="about-principles-grid">
            {pillars.map((item) => (
              <article key={item.title} className="about-principle-card">
                <span className="about-principle-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-gallery-wrap about-reveal" id="album-foto">
          <AboutSectionHead
            eyebrow="Viata scolii"
            title="Album foto"
            lead="Momente din ateliere, evenimente, sport si activitati cu elevii nostri."
          />

          <div className="about-gallery-toolbar">
            <div className="about-gallery-filters" role="tablist" aria-label="Filtre album foto">
              {galleryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`about-gallery-filter${activeFilter === filter ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <p className="about-gallery-count" aria-live="polite">
              {filteredGallery.length} {filteredGallery.length === 1 ? 'imagine' : 'imagini'}
            </p>
          </div>

          <div className={`about-gallery-mosaic${filteredGallery.length < 4 ? ' is-compact' : ''}`}>
            {filteredGallery.map((item, index) => (
              <figure
                key={`${item.category}-${index}`}
                className={`about-gallery-cell${index === 0 ? ' is-featured' : ''}`}
              >
                <button
                  type="button"
                  className="about-gallery-trigger"
                  onClick={() => setLightboxImage(item)}
                  aria-label={`Deschide imaginea: ${item.alt}`}
                >
                  <img src={item.src} alt={item.alt} loading="lazy" />
                </button>
              </figure>
            ))}
          </div>

          {filteredGallery.length === 0 ? (
            <p className="about-gallery-empty">Nu exista imagini pentru categoria selectata.</p>
          ) : null}
        </section>

        <section className="about-cta-panel about-reveal" aria-label="Actiuni rapide">
          <div className="about-cta-copy">
            <AboutSectionHead
              eyebrow="Contact"
              title="Hai sa discutam"
              lead={
                hasAuthSession()
                  ? 'Consulta documentele, calendarul sau trimite-ne un mesaj — suntem aici pentru tine.'
                  : 'Consulta documentele sau trimite-ne un mesaj — suntem aici pentru tine.'
              }
            />
          </div>
          <div className="about-cta-actions">
            <Link to="/documente" className="about-cta-btn">
              <span>Documente scolare</span>
              <small>Admitere, regulamente, formulare</small>
            </Link>
            {hasAuthSession() ? (
              <Link to="/calendar" className="about-cta-btn">
                <span>Calendar evenimente</span>
                <small>Activitati si date importante</small>
              </Link>
            ) : null}
            <Link to="/contact" className="about-cta-btn is-accent">
              <span>Contacteaza-ne</span>
              <small>Raspundem in cel mai scurt timp</small>
            </Link>
          </div>
        </section>
      </div>

      {lightboxImage
        ? createPortal(
            <div
              className="about-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={lightboxImage.category}
              onClick={() => setLightboxImage(null)}
            >
              <button
                type="button"
                className="about-lightbox-close"
                aria-label="Inchide imaginea"
                onClick={() => setLightboxImage(null)}
              >
                ×
              </button>
              <figure className="about-lightbox-frame" onClick={(event) => event.stopPropagation()}>
                <img src={lightboxImage.src} alt={lightboxImage.category} />
              </figure>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}

export default AboutPage;
