import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BreakdownIcon, CseLogo, ErasmusLogo, OfferIcon } from '../components/home/HomeIcons.jsx';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);

const HERO_IMAGE = photoUrl('home-hero.jpg');

const statGroups = [
  {
    id: 'elevi',
    value: 800,
    unit: 'elevi',
    icon: 'students',
    breakdown: [
      { value: 581, label: 'liceeni', icon: 'graduation' },
      { value: 219, label: 'preșcolari', icon: 'backpack' }
    ]
  },
  {
    id: 'sali',
    value: 33,
    unit: 'săli',
    icon: 'rooms',
    breakdown: [
      { value: 23, label: 'săli de clasă', icon: 'classroom' },
      { value: 10, label: 'laboratoare și ateliere', icon: 'lab' }
    ]
  },
  {
    id: 'angajati',
    value: 76,
    unit: 'angajați',
    icon: 'staff',
    breakdown: [
      { value: 45, label: 'cadre didactice', icon: 'teacher' },
      { value: 31, label: 'personal nedidactic și auxiliar', icon: 'auxiliary' }
    ]
  }
];

const valueTags = [
  { label: 'Respect', tone: 'indigo' },
  { label: 'Educație', tone: 'gold' },
  { label: 'Profesionalism', tone: 'purple' },
  { label: 'Echilibru', tone: 'teal' },
  { label: 'Comunitate', tone: 'rose' },
  { label: 'Toleranță', tone: 'amber' }
];

const assetItems = [
  'Fotografii de campus pe timp de zi, de înaltă rezoluție.',
  'Fotografii ale laboratoarelor moderne.',
  'Descrieri detaliate ale noului curriculum.',
  'Puncte de date specifice pentru secțiunea "Liceul în Cifre".',
  'Pictograme personalizate și detaliate pentru fiecare specializare.',
  'Fotografii ale proiectelor specifice (ex: bucătărie didactică, VR) de înaltă calitate.',
  'Logouri pentru Erasmus+ și CSE.'
];

const offers = [
  {
    title: 'Tehnician în turism',
    desc: 'Comunicare, ospitalitate, ghidaj și organizare.',
    icon: 'tourism'
  },
  {
    title: 'Tehnician mecanic',
    desc: 'Tehnologii moderne, practică aplicată și competențe tehnice.',
    icon: 'mechanic'
  },
  {
    title: 'Ospătar / Vânzător',
    desc: 'Meserii căutate, lucru cu publicul și abilități reale.',
    icon: 'hospitality'
  },
  {
    title: 'Învățământ Profesional Dual',
    desc: 'Carieră sigură și susținere prin practică și parteneriate.',
    icon: 'dual',
    highlight: true
  },
  {
    title: 'Maistru în construcții civile (postliceal)',
    desc: 'Specializare avansată și competențe de coordonare.',
    icon: 'construction'
  }
];

const projects = [
  {
    title: 'Mansarda Inteligentă – Smart Learning Loft',
    desc: 'Hub educațional, bibliotecă modernă și tehnologie pentru învățare.',
    badge: 'Proiect 01',
    image: photoUrl('WhatsApp Image 2026-05-26 at 21.17.22.jpeg'),
    imageAlt: 'Student utilizând echipament VR în laborator'
  },
  {
    title: 'Restaurant Didactic Academia Gustului',
    desc: 'Spațiu modern de instruire culinară, practică și cultură a ospitalității.',
    badge: 'Proiect 02',
    image: photoUrl('WhatsApp Image 2026-05-26 at 21.13.53.jpeg'),
    imageAlt: 'Prezentare culinară profesională în bucătăria didactică'
  }
];

const community = [
  {
    title: 'Proiecte ERASMUS+',
    desc: 'Deschidere europeană',
    logo: 'erasmus'
  },
  {
    title: 'Proiectul ECLESSIA',
    desc: 'Tradiție și voluntariat'
  },
  {
    title: 'Consiliul Școlar al Elevilor (CȘE)',
    desc: 'Când elevii prind curaj, școala prinde viață!',
    highlight: true,
    logo: 'cse',
    image: photoUrl('chat-hero-people.jpg'),
    imageAlt: 'Ședință a Consiliului Școlar al Elevilor'
  }
];

function useCountUpGroup(targets) {
  const ref = useRef(null);
  const [values, setValues] = useState(() => targets.map(() => 0));
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      setValues(targets);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();
        const duration = 950;

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValues(targets.map((target) => Math.round(target * eased)));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targets]);

  return { ref, values };
}

function formatNum(n) {
  return new Intl.NumberFormat('ro-RO').format(n);
}

function StatGroupCard({ group }) {
  const targets = useMemo(
    () => [group.value, group.breakdown[0].value, group.breakdown[1].value],
    [group]
  );
  const { ref, values } = useCountUpGroup(targets);

  return (
    <article ref={ref} className="home2-stat-card">
      <header className="home2-stat-card-head">
        <div className="home2-stat-card-icon" aria-hidden="true">
          <BreakdownIcon type={group.icon} />
        </div>
        <div className="home2-stat-card-total">
          <strong className="home2-stat-card-value">{formatNum(values[0])}</strong>
          <span className="home2-stat-card-unit">{group.unit}</span>
        </div>
      </header>

      <div className="home2-stat-card-divider" aria-hidden="true" />

      <ul className="home2-stat-breakdown">
        {group.breakdown.map((item, index) => (
          <li key={item.label} className="home2-stat-break-item">
            <span className="home2-stat-break-icon" aria-hidden="true">
              <BreakdownIcon type={item.icon} />
            </span>
            <span className="home2-stat-break-copy">
              <strong>{formatNum(values[index + 1])}</strong>
              <em>{item.label}</em>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function HomePage() {
  return (
    <section className="page-shell home2-page">
      <div className="home2-bg-pattern" aria-hidden="true">
        <span className="home2-bg-icon home2-bg-icon--1">⚙</span>
        <span className="home2-bg-icon home2-bg-icon--2">📖</span>
        <span className="home2-bg-icon home2-bg-icon--3">🎓</span>
        <span className="home2-bg-icon home2-bg-icon--4">⚛</span>
        <span className="home2-bg-icon home2-bg-icon--5">⚙</span>
        <span className="home2-bg-icon home2-bg-icon--6">📖</span>
      </div>

      <header className="home2-hero-wrap" aria-label="Hero">
        <div className="home2-hero">
          <img
            src={HERO_IMAGE}
            alt="Liceul Tehnologic Nr. 1 Câmpulung Moldovenesc — clădirea școlii"
            className="home2-hero-media"
            loading="eager"
            fetchPriority="high"
          />
          <div className="home2-hero-scrim" aria-hidden="true" />
          <div className="home2-hero-vignette" aria-hidden="true" />

          <div className="home2-hero-inner">
            <div className="home2-hero-content">
              <p className="home2-hero-eyebrow">Educație · Performanță · Comunitate</p>

              <h1 className="home2-hero-title">
                <span className="home2-hero-title-main">Liceul Tehnologic Nr. 1</span>
                <span className="home2-hero-title-city">Câmpulung Moldovenesc</span>
              </h1>

              <p className="home2-hero-heritage" aria-label="151 ani de tradiție">
                151 ani de tradiție · 1873 – 2024
              </p>

              <div className="home2-hero-actions">
                <a className="btn home2-btn-primary" href="#oferta-educationala" aria-label="Oferta Educațională 2024-2025">
                  Oferta Educațională 2024-2025
                </a>
                <Link className="btn home2-btn-secondary" to="/despre-noi" aria-label="Află mai multe">
                  Află mai multe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="home2-section" id="traditie-valori" aria-label="Tradiție și valori">
        <div className="home2-section-head">
          <h2>Tradiție și valori</h2>
          <p className="muted">
            Cea mai veche instituție de învățământ din Câmpulung Moldovenesc – <strong>151 ANI (1873 - 2024)</strong>.
          </p>
        </div>

        <div className="home2-info-grid home2-info-grid--two">
          <article className="home2-info-card">
            <p className="home2-info-title">151 ANI</p>
            <p className="home2-info-desc">1873 - 2024 • Tradiție, continuitate și performanță.</p>
          </article>
          <article className="home2-info-card">
            <p className="home2-info-title">Valori</p>
            <div className="home2-value-chips" aria-label="Valori fundamentale">
              {valueTags.map((v) => (
                <span key={v.label} className={`home2-chip home2-chip--${v.tone}`}>
                  {v.label}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="home2-section home2-section--kpis" aria-label="Liceul în cifre">
        <div className="home2-section-head home2-section-head--kpis">
          <h2>Liceul în cifre</h2>
          <p className="muted">Date reale, impact real în comunitate — structură completă a comunității școlare.</p>
        </div>

        <div className="home2-stats-panel">
          <div className="home2-stats-panel-bg" aria-hidden="true" />
          <div className="home2-stats-grid">
            {statGroups.map((group) => (
              <StatGroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      </section>

      <section className="home2-section home2-section--assets" aria-label="Informații și asset-uri necesare">
        <article className="home2-assets-card">
          <h2 className="home2-assets-title">Informații și Asset-uri Necesare</h2>
          <ul className="home2-assets-list">
            {assetItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="home2-section" id="oferta-educationala" aria-label="Oferta educațională">
        <div className="home2-section-head">
          <h2>Oferta Educațională 2024-2025</h2>
          <p className="muted">Profile și specializări orientate spre piața muncii.</p>
        </div>

        <div className="home2-offer-grid">
          {offers.map((item) => (
            <article key={item.title} className={`home2-offer-card${item.highlight ? ' is-highlight' : ''}`}>
              <div className="home2-offer-icon" aria-hidden="true">
                <OfferIcon type={item.icon} />
              </div>
              <h3>{item.title}</h3>
              <p className="muted">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home2-section home2-section--projects" aria-label="Proiecte inovatoare">
        <div className="home2-section-head">
          <h2>Proiecte inovatoare</h2>
          <p className="muted">Punctul forte: spații moderne pentru învățare și practică.</p>
        </div>

        <div className="home2-projects">
          {projects.map((p) => (
            <article key={p.title} className="home2-project-card">
              <div className="home2-project-media">
                <img src={p.image} alt={p.imageAlt} className="home2-project-photo" loading="lazy" />
              </div>
              <div className="home2-project-body">
                <span className="home2-badge">{p.badge}</span>
                <h3>{p.title}</h3>
                <p className="muted">{p.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home2-section home2-section--community" aria-label="Comunitate și dinamism">
        <div className="home2-section-head">
          <h2>Comunitate &amp; dinamism</h2>
          <p className="muted">Activități extrașcolare și proiecte care dau energie școlii.</p>
        </div>

        <div className="home2-community-grid">
          {community.map((c) => (
            <article key={c.title} className={`home2-community-card${c.highlight ? ' is-highlight' : ''}`}>
              {c.image ? (
                <div className="home2-community-media">
                  <img src={c.image} alt={c.imageAlt} loading="lazy" />
                </div>
              ) : null}
              <div className="home2-community-body">
                {c.logo === 'erasmus' ? (
                  <div className="home2-community-logo">
                    <ErasmusLogo />
                  </div>
                ) : null}
                {c.logo === 'cse' ? (
                  <div className="home2-community-logo home2-community-logo--cse">
                    <CseLogo />
                  </div>
                ) : null}
                <h3>{c.title}</h3>
                <p className="muted">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
