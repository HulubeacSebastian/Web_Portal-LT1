import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);

const stats = [
  { label: 'Raport elevi-profesor', value: '10:1', hint: 'Atentie personalizata' },
  { label: 'Rata de angajare', value: '81%', hint: 'Absolventi in piata muncii' },
  { label: 'Traditie', value: '150+', hint: 'Ani de excelenta' },
  { label: 'Profiluri tehnice', value: '5+', hint: 'Calificari profesionale' },
];

const timeline = [
  {
    year: '1873',
    title: 'Infiintare',
    text: 'Liceul isi incepe activitatea in Campulung Moldovenesc, cu orientare tehnica inca de la origini.',
  },
  {
    year: '1960–1980',
    title: 'Dezvoltare tehnica',
    text: 'Extinderea atelierelor si consolidarea pregatirii practice pentru meserii industriale locale.',
  },
  {
    year: '2000–2010',
    title: 'Parteneriate economice',
    text: 'Colaborari cu agenti economici din regiune pentru stagii, practica si orientare profesionala.',
  },
  {
    year: '2015–2020',
    title: 'Modernizare',
    text: 'Investitii in echipamente si laboratoare pentru profiluri tehnologice actuale.',
  },
  {
    year: '2026',
    title: 'Portal educational',
    text: 'Acces digital la documente, calendar si informatii pentru elevi, parinti si profesori.',
  },
];

const pillars = [
  {
    icon: '01',
    title: 'Misiune',
    text: 'Competente teoretice si practice, recunoscute pe piata muncii si utile pentru studii superioare tehnice.',
  },
  {
    icon: '02',
    title: 'Viziune',
    text: 'Un liceu tehnologic modern, conectat la economia locala si deschis spre inovare si performanta.',
  },
  {
    icon: '03',
    title: 'Valori',
    text: 'Respect, munca in echipa, profesionalism, incluziune si orientare spre rezultate pentru fiecare elev.',
  },
];

const highlights = [
  'Ateliere si laboratoare pentru invatare aplicata',
  'Parteneriate cu firme locale pentru practica',
  'Trasee clare catre angajare sau studii tehnice',
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
        <section className="about-story about-reveal" id="cine-suntem">
          <div className="about-story-visual">
            <img
              src={photoUrl('WhatsApp Image 2026-05-26 at 21.13.06.jpeg')}
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
              lead="O comunitate scolara orientata spre competente reale si oportunitati concrete pentru elevi."
            />
            <p>
              La Liceul Tehnologic Nr. 1, credem ca educatia practica este cheia succesului. Misiunea
              noastra este sa oferim elevilor competentele necesare pentru a reusi pe o piata a muncii in
              continua schimbare.
            </p>
            <p>
              Prin ateliere moderne, parteneriate cu agenti economici si un corp profesoral dedicat,
              asiguram tranzitia usoara de la scoala la cariera sau catre studii superioare in domeniul
              tehnic.
            </p>
            <ul className="about-story-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
              lead="Consulta documentele, calendarul sau trimite-ne un mesaj — suntem aici pentru tine."
            />
          </div>
          <div className="about-cta-actions">
            <Link to="/documente" className="about-cta-btn">
              <span>Documente scolare</span>
              <small>Admitere, regulamente, formulare</small>
            </Link>
            <Link to="/calendar" className="about-cta-btn">
              <span>Calendar evenimente</span>
              <small>Activitati si date importante</small>
            </Link>
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
