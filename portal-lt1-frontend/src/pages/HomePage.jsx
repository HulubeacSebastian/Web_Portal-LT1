import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);

const stats = [
  { label: 'elevi', value: 800, suffix: '' },
  { label: 'săli de clasă', value: 33, suffix: '' },
  { label: 'laboratoare și ateliere', value: 10, suffix: '' },
  { label: 'angajați', value: 76, suffix: '' }
];

const values = ['Respect', 'Educație', 'Profesionalism', 'Echilibru', 'Comunitate', 'Toleranță'];

const offers = [
  { title: 'Tehnician în turism', desc: 'Comunicare, ospitalitate, ghidaj și organizare.', icon: '🧭' },
  { title: 'Tehnician mecanic', desc: 'Tehnologii moderne, practică aplicată și competențe tehnice.', icon: '⚙️' },
  { title: 'Ospătar / Vânzător', desc: 'Meserii căutate, lucru cu publicul și abilități reale.', icon: '🍽️' },
  {
    title: 'Învățământ Profesional Dual',
    desc: 'Carieră sigură și susținere prin practică și parteneriate.',
    icon: '🤝',
    highlight: true
  },
  { title: 'Maistru în construcții civile (postliceal)', desc: 'Specializare avansată și competențe de coordonare.', icon: '🏗️' }
];

const projects = [
  {
    title: 'Mansarda Inteligentă – Smart Learning Loft',
    desc: 'Hub educațional, bibliotecă modernă și tehnologie pentru învățare.',
    badge: 'Proiect 01'
  },
  {
    title: 'Restaurant Didactic Academia Gustului',
    desc: 'Spațiu modern de instruire culinară, practică și cultură a ospitalității.',
    badge: 'Proiect 02'
  }
];

const community = [
  {
    title: 'Proiecte ERASMUS+',
    desc: 'Deschidere europeană'
  },
  {
    title: 'Proiectul ECLESSIA',
    desc: 'Tradiție și voluntariat'
  },
  {
    title: 'Consiliul Școlar al Elevilor (CȘE)',
    desc: 'Când elevii prind curaj, școala prinde viață!',
    highlight: true
  }
];

function useCountUpOnView(targetValue) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      setValue(targetValue);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();
        const duration = 900;
        const from = 0;

        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(from + (targetValue - from) * eased));
          if (t < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [targetValue]);

  return { ref, value };
}

function StatCard({ label, value }) {
  const { ref, value: animated } = useCountUpOnView(value);
  const formatted = useMemo(() => {
    return new Intl.NumberFormat('ro-RO').format(animated);
  }, [animated]);

  return (
    <article ref={ref} className="home2-kpi">
      <strong className="home2-kpi-value">{formatted}</strong>
      <span className="home2-kpi-label">{label}</span>
    </article>
  );
}

function HomePage() {
  return (
    <section className="page-shell home2-page">
      <header className="home2-hero" aria-label="Hero">
        <img
          src={photoUrl('home-hero.jpg')}
          alt="Liceul Tehnologic Nr. 1"
          className="home2-hero-media"
        />
        <div className="home2-hero-scrim" aria-hidden="true" />

        <div className="home2-hero-inner">
          <div className="home2-hero-glass">
            <p className="home2-hero-eyebrow">Educație • Performanță • Comunitate</p>
            <h1>Liceul Tehnologic Nr. 1 Câmpulung Moldovenesc</h1>
            <p className="home2-hero-subtitle">Educație • Performanță • Comunitate</p>

            <div className="home2-hero-actions">
              <a className="btn home2-btn-primary" href="#" aria-label="Oferta Educațională 2024-2025">
                Oferta Educațională 2024-2025
              </a>
              <Link className="btn home2-btn-secondary" to="/despre-noi" aria-label="Află mai multe">
                Află mai multe
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="home2-section" aria-label="Tradiție și valori">
        <div className="home2-section-head">
          <h2>Tradiție și valori</h2>
          <p className="muted">
            Cea mai veche instituție de învățământ din Câmpulung Moldovenesc – <strong>151 ANI (1873 - 2024)</strong>.
          </p>
        </div>

        <div className="home2-info-grid">
          <article className="home2-info-card">
            <p className="home2-info-title">151 ANI</p>
            <p className="home2-info-desc">1873 - 2024 • Tradiție, continuitate și performanță.</p>
          </article>
          <article className="home2-info-card">
            <p className="home2-info-title">Identitate</p>
            <p className="home2-info-desc">Seriozitate, inovație și formare profesională aplicată.</p>
          </article>
          <article className="home2-info-card">
            <p className="home2-info-title">Valori</p>
            <div className="home2-value-chips" aria-label="Valori fundamentale">
              {values.map((v) => (
                <span key={v} className="home2-chip">
                  {v}
                </span>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="home2-section home2-section--kpis" aria-label="Liceul în cifre">
        <div className="home2-section-head">
          <h2>Liceul în cifre</h2>
          <p className="muted">Date reale, impact real în comunitate.</p>
        </div>

        <div className="home2-kpis">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} />
          ))}
        </div>
      </section>

      <section className="home2-section" aria-label="Oferta educațională">
        <div className="home2-section-head">
          <h2>Oferta Educațională 2024-2025</h2>
          <p className="muted">Profile și specializări orientate spre piața muncii.</p>
        </div>

        <div className="home2-offer-grid">
          {offers.map((item) => (
            <article key={item.title} className={`home2-offer-card${item.highlight ? ' is-highlight' : ''}`}>
              <div className="home2-offer-icon" aria-hidden="true">
                {item.icon}
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
              <div className="home2-project-media" aria-hidden="true">
                <div className="home2-project-mock" />
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

        <div className="home2-slider" role="region" aria-label="Activități extrașcolare">
          {community.map((c) => (
            <article key={c.title} className={`home2-slide${c.highlight ? ' is-highlight' : ''}`}>
              <h3>{c.title}</h3>
              <p className="muted">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
