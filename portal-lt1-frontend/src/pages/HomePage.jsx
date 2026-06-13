import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BreakdownIcon, ErasmusLogo } from '../components/home/HomeIcons.jsx';
import { hasAuthSession } from '../utils/authSession';

const CSE_LOGO = '/assets/cselt1.png';
const RESTAURANT_IMAGE = '/assets/restaurant.jpeg';
const MANSARDA_IMAGE = '/assets/pod.jpeg';

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

const portalDiscover = [
  {
    title: 'Oferta educațională',
    desc: 'Specializări, ateliere moderne și trasee de formare pentru piața muncii — anul 2024-2025.',
    to: '#oferta-educationala',
    hash: true,
    cta: 'Vezi programele'
  },
  {
    title: 'Documente școlare',
    desc: 'Regulamente, planuri de învățământ și informări pentru elevi, părinți și cadre didactice.',
    to: '/documente',
    cta: 'Accesează documentele'
  },
  {
    title: 'Calendar școlar',
    desc: 'Examene, activități, întâlniri și evenimente importante pe parcursul anului.',
    to: '/calendar',
    cta: 'Vezi calendarul'
  },
  {
    title: 'Despre liceu',
    desc: 'Istorie, identitate, proiecte inovatoare și comunitatea LT1 din Câmpulung Moldovenesc.',
    to: '/despre-noi',
    cta: 'Cunoaște liceul'
  }
];

const offers = [
  {
    title: 'Tehnician în turism',
    desc: 'Comunicare, ospitalitate, ghidaj și organizare.',
    tone: 'tourism',
    tag: 'Turism'
  },
  {
    title: 'Tehnician mecanic',
    desc: 'Tehnologii moderne, practică aplicată și competențe tehnice.',
    tone: 'mechanic',
    tag: 'Mecanică'
  },
  {
    title: 'Ospătar / Vânzător',
    desc: 'Meserii căutate, lucru cu publicul și abilități reale.',
    tone: 'hospitality',
    tag: 'HoReCa'
  },
  {
    title: 'Învățământ Profesional Dual',
    desc: 'Carieră sigură și susținere prin practică și parteneriate.',
    tone: 'dual',
    tag: 'Dual',
    featured: true
  },
  {
    title: 'Maistru în construcții civile (postliceal)',
    desc: 'Specializare avansată și competențe de coordonare.',
    tone: 'construction',
    tag: 'Construcții'
  }
];

const projects = [
  {
    title: 'Mansarda Inteligentă – Smart Learning Loft',
    desc: 'Hub educațional, bibliotecă modernă și tehnologie pentru învățare — spațiu dedicat explorării și cercetării.',
    badge: 'Proiect 01',
    tone: 'loft',
    image: MANSARDA_IMAGE,
    imageAlt: 'Mansarda Inteligentă – Smart Learning Loft'
  },
  {
    title: 'Restaurant Didactic Academia Gustului',
    desc: 'Spațiu modern de instruire culinară, practică și cultură a ospitalității — pregătire reală pentru industrie.',
    badge: 'Proiect 02',
    tone: 'culinary',
    image: RESTAURANT_IMAGE,
    imageAlt: 'Restaurant Didactic Academia Gustului — spațiu de instruire culinară'
  }
];

const community = [
  {
    title: 'Proiecte ERASMUS+',
    desc: 'Mobilități, parteneriate europene și experiențe care deschid orizonturi elevilor noștri.',
    tone: 'erasmus',
    logo: 'erasmus',
    image: photoUrl('WhatsApp Image 2026-05-26 at 21.12.34.jpeg'),
    imageAlt: 'Elevi în activitate Erasmus+'
  },
  {
    title: 'Proiectul ECLESSIA',
    desc: 'Tradiție, solidaritate și voluntariat — implicare activă în viața spirituală și socială a comunității.',
    tone: 'eclessia',
    image: photoUrl('eclessia-comunitate.png'),
    imageAlt: 'Comunitate ECLESSIA — activități tradiționale la Liceul Tehnologic Nr. 1'
  },
  {
    title: 'Consiliul Școlar al Elevilor (CȘE)',
    desc: 'Când elevii prind curaj, școala prinde viață! Vocea elevilor în deciziile care îi privesc.',
    tone: 'cse',
    featured: true,
    logoSrc: CSE_LOGO,
    logoAlt: 'Logo Consiliul Școlar al Elevilor',
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
  const discoverItems = portalDiscover.filter(
    (item) => item.to !== '/calendar' || hasAuthSession()
  );

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

      <div className="home2-about-cluster" id="despre-liceu">
        <section className="home2-section home2-section--heritage" id="traditie-valori" aria-label="Tradiție și valori">
          <div className="home2-block-head">
            <span className="home2-section-eyebrow">Rădăcini</span>
            <h2>Tradiție și valori</h2>
            <p className="muted">
              Cea mai veche instituție de învățământ din Câmpulung Moldovenesc — peste un secol și jumătate de
              formare tehnică, cu rădăcini din <strong>1873</strong>.
            </p>
          </div>

          <div className="home2-info-grid home2-info-grid--two">
            <article className="home2-info-card home2-info-card--history">
              <p className="home2-info-kicker">1873 – 2024</p>
              <p className="home2-info-title">151 ani de istorie</p>
              <p className="home2-info-desc">
                De la primele școli profesionale din Bucovina la programe moderne pentru piața muncii — continuitate,
                seriozitate și performanță pentru fiecare generație de elevi.
              </p>
            </article>
            <article className="home2-info-card home2-info-card--values">
              <p className="home2-info-title">Valori fundamentale</p>
              <p className="home2-info-desc home2-info-desc--lead">
                Principiile care ne ghidează în sala de clasă, în laborator și în comunitate:
              </p>
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

        <div className="home2-about-divider" aria-hidden="true">
          <span />
        </div>

        <section className="home2-section home2-section--kpis" aria-label="Liceul în cifre">
          <div className="home2-block-head">
            <span className="home2-section-eyebrow">Impact</span>
            <h2>Liceul în cifre</h2>
            <p className="muted">Date reale, impact concret în comunitate — elevi, spații și echipa școlii.</p>
          </div>

          <div className="home2-stats-grid">
            {statGroups.map((group) => (
              <StatGroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>
      </div>

      <section className="home2-section home2-section--discover" aria-label="Ce găsești pe portal">
        <div className="home2-block-head home2-block-head--center">
          <span className="home2-section-eyebrow">Portal educațional</span>
          <h2>Ce găsești aici</h2>
          <p className="muted">
            Un singur loc pentru informații despre liceu — de la programe și documente, până la evenimente și
            povestea comunității noastre.
          </p>
        </div>

        <div className="home2-discover-grid">
          {discoverItems.map((item) => {
            const body = (
              <>
                <h3>{item.title}</h3>
                <p className="muted">{item.desc}</p>
                <span className="home2-discover-cta">{item.cta}</span>
              </>
            );

            if (item.hash) {
              return (
                <a key={item.title} href={item.to} className="home2-discover-card">
                  {body}
                </a>
              );
            }

            return (
              <Link key={item.title} to={item.to} className="home2-discover-card">
                {body}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home2-section home2-section--offer" aria-label="Oferta educațională">
        <div className="home2-block-head" id="oferta-educationala">
          <span className="home2-section-eyebrow">Formare profesională</span>
          <h2>Oferta Educațională 2024-2025</h2>
          <p className="muted">Profile și specializări orientate spre piața muncii — practică, ateliere și competențe pentru carieră.</p>
        </div>

        <div className="home2-offer-grid">
          {offers.map((item) => (
            <article
              key={item.title}
              className={`home2-offer-card home2-offer-card--${item.tone}${item.featured ? ' is-featured' : ''}`}
            >
              <span className="home2-offer-tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p className="home2-offer-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="home2-impact-cluster">
        <section className="home2-section home2-section--projects" aria-label="Proiecte inovatoare">
          <div className="home2-block-head">
            <span className="home2-section-eyebrow">Spații moderne</span>
            <h2>Proiecte inovatoare</h2>
            <p className="muted">Laboratoare, ateliere și hub-uri unde teoria devine practică aplicată.</p>
          </div>

          <div className="home2-projects">
            {projects.map((p) => (
              <article key={p.title} className={`home2-project-card home2-project-card--${p.tone}`}>
                <div className="home2-project-media">
                  <img src={p.image} alt={p.imageAlt} className="home2-project-photo" loading="lazy" />
                  <div className="home2-project-media-scrim" aria-hidden="true" />
                </div>
                <div className="home2-project-body">
                  <span className="home2-project-tag">{p.badge}</span>
                  <h3>{p.title}</h3>
                  <p className="home2-project-desc">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="home2-about-divider" aria-hidden="true">
          <span />
        </div>

        <section className="home2-section home2-section--community" aria-label="Comunitate și dinamism">
          <div className="home2-block-head">
            <span className="home2-section-eyebrow">Viața școlii</span>
            <h2>Comunitate &amp; dinamism</h2>
            <p className="muted">Proiecte, parteneriate și inițiative care dau energie și identitate liceului.</p>
          </div>

          <div className="home2-community-grid">
            {community.map((c) => (
              <article
                key={c.title}
                className={`home2-community-card home2-community-card--${c.tone}${c.featured ? ' is-featured' : ''}`}
              >
                <div className="home2-community-hero">
                  <img src={c.image} alt={c.imageAlt} loading="lazy" />
                  <div className="home2-community-hero-scrim" aria-hidden="true" />
                  {c.logoSrc ? (
                    <div className="home2-community-hero-logo home2-community-hero-logo--img">
                      <img src={c.logoSrc} alt={c.logoAlt} loading="lazy" />
                    </div>
                  ) : null}
                  {c.logo === 'erasmus' ? (
                    <div className="home2-community-hero-logo home2-community-hero-logo--erasmus">
                      <ErasmusLogo />
                    </div>
                  ) : null}
                </div>
                <div className="home2-community-body">
                  <h3>{c.title}</h3>
                  <p className="home2-community-desc">{c.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

export default HomePage;
