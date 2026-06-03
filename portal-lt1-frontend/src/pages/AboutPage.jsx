import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { hasAuthSession } from '../utils/authSession';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);

const stats = [
  { label: 'Elevi 👩‍🎓', value: '800', hint: 'Comunitate scolara activa' },
  { label: 'Liceeni 🎓', value: '581', hint: 'Invatamant liceal' },
  { label: 'Prescolari 🧒', value: '219', hint: 'Invatamant prescolar' },
  { label: 'Sali 🏫', value: '33', hint: '23 sali de clasa' },
  { label: 'Lab & ateliere 🔧', value: '10', hint: 'Spatii pentru invatare aplicata' },
  { label: 'Angajati 👥', value: '76', hint: '45 cadre didactice + 31 personal suport' },
];

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

const visualTimeline = [
  { year: '1873', label: 'Scoala profesionala de stat', image: encodeURI('/assets/poza_liceu_1873.png') },
  { year: '1895', label: 'Scoala de lemnarit', image: photoUrl('WhatsApp Image 2026-05-26 at 21.13.06.jpeg') },
  { year: '1927', label: 'Scoala de arte si meserii', image: photoUrl('WhatsApp Image 2026-05-26 at 21.09.21.jpeg') },
  { year: '1936', label: 'Gimnaziul industrial', image: photoUrl('WhatsApp Image 2026-05-26 at 21.11.17.jpeg') },
  { year: '1945', label: 'Stabilire la Campulung Moldovenesc', image: photoUrl('WhatsApp Image 2026-05-26 at 21.15.17.jpeg') },
  { year: '1955', label: 'Ucenici – Constructii', image: photoUrl('WhatsApp Image 2026-05-26 at 21.17.21.jpeg') },
  { year: '1974', label: 'Grup scolar de constructii', image: photoUrl('WhatsApp Image 2026-05-26 at 21.17.22.jpeg') },
  { year: '2012', label: 'Liceul Tehnologic Nr. 1', image: photoUrl('WhatsApp Image 2026-05-26 at 21.17.23.jpeg') },
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

const galleryFilters = ['Toate', 'Ateliere', 'Evenimente', 'Sport', 'Scoala'];

const GALLERY_PHOTOS = [
  "WhatsApp Image 2026-05-26 at 21.08.55.jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.08.56.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.21.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.46.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (6).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (7).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47 (8).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.47.jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.09.48.jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.17.jpeg",
  "WhatsApp Image 2026-05-26 at 21.11.18.jpeg",
  "WhatsApp Image 2026-05-26 at 21.12.34.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.06.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.07.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.53.jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.13.54.jpeg",
  "WhatsApp Image 2026-05-26 at 21.15.17.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (4).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21 (5).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.21.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.22 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (1).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (2).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23 (3).jpeg",
  "WhatsApp Image 2026-05-26 at 21.17.23.jpeg",
  "WhatsApp Image 2026-05-26 at 2ss1.12.34.jpeg",
  "WhatsApp Image 2026-05-26 ats 21.17.23.jpeg",
  "WhatsApp Image 2026-05-26ss at 21.12.34.jpeg",
  "WhatsApp Image 2026-05-2s6 at 21.17.22.jpeg",
  "WhatsApp Image 2026-05s-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-s05-26 at 21.17.22.jpeg",
  "WhatsApp Image 2026-ss05-26 at 21.17.22.jpeg",
  "WhatsApp Image 202ss-05-26 at 21.12.34.jpeg",
  "WhatsApps Image 2026-05-26 at 21.17.22.jpeg",
  "WhatsssApp Image 2026-05-26 at 21.17.22.jpeg"
];

const galleryCategories = ['Scoala', 'Ateliere', 'Evenimente', 'Sport'];

const galleryItems = GALLERY_PHOTOS.map((filename, index) => ({
  src: photoUrl(filename),
  alt: filename.replace(/\.(jpe?g|png|webp)$/i, ''),
  category: galleryCategories[index % galleryCategories.length]
}));

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
                  <strong>151</strong>
                  <em>ani</em>
                </span>
                <span className="about-heritage-badge is-gold">
                  <strong>1873–2024</strong>
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
            <AboutSectionHead
              eyebrow="Identitate"
              title="Cine suntem"
              lead="Cea mai veche institutie de invatamant profesional si tehnic din Campulung Moldovenesc, cu traditie din 1873."
            />
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

        <section className="about-metrics about-reveal" aria-label="Indicatori liceu">
          <div className="about-metrics-grid">
            {stats.map((item) => (
              <article key={item.label} className="about-metric-card">
                <strong>{item.value}</strong>
                <p>{item.label}</p>
                <span>{item.hint}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-timeline-wrap about-reveal" id="istoric">
          <AboutSectionHead
            eyebrow="Evolutie"
            title="Istoricul nostru"
            lead="Repere care arata cum am crescut impreuna cu comunitatea locala."
          />
          <div className="about-visual-timeline" aria-label="Istoric vizual">
            <ol className="about-visual-track">
              {visualTimeline.map((item) => (
                <li key={item.year} className="about-visual-node">
                  <div className="about-visual-ring" aria-hidden="true" />
                  <figure className="about-visual-photo">
                    <img src={item.image} alt="" loading="lazy" />
                  </figure>
                  <div className="about-visual-meta">
                    <strong>{item.year}</strong>
                    <span>{item.label}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
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
                  <span className="about-gallery-overlay">
                    <span className="about-gallery-expand" aria-hidden="true">
                      +
                    </span>
                    <span className="about-gallery-caption">
                      <strong>{item.category}</strong>
                      <em>{item.alt}</em>
                    </span>
                  </span>
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

      {lightboxImage ? (
        <div
          className="about-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={lightboxImage.alt}
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
            <img src={lightboxImage.src} alt={lightboxImage.alt} />
            <figcaption>
              <strong>{lightboxImage.category}</strong> — {lightboxImage.alt}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </section>
  );
}

export default AboutPage;
