import { Link } from 'react-router-dom';

const photoUrl = (filename) => encodeURI(`/assets/Poze_liceu/${filename}`);

const stats = [
  { label: 'Elevi 👩‍🎓', value: '800' },
  { label: 'Sali 🏫', value: '33' },
  { label: 'Lab & ateliere 🔧', value: '10' },
  { label: 'Angajati 👥', value: '76' },
];

const events = [
  {
    date: '2025–2026',
    text: 'Extinderea mobilitatilor Erasmus+ si schimburi educationale pentru elevi si profesori.',
    cta: 'DESPRE ERASMUS+',
  },
  {
    date: '2025–2026',
    text: 'Infiintarea unui Centru de Practica Modern si programe de dezvoltare tehnica actualizate.',
    cta: 'DIRECTII STRATEGICE',
  },
  {
    date: '2025–2026',
    text: 'Digitalizarea procesului educativ: resurse online, comunicare eficienta si acces rapid la informatii.',
    cta: 'ACCES PLATFORME',
  },
  {
    date: '2025–2026',
    text: 'Proiecte inovative pentru invatare aplicata: spatii moderne, activitati practice si cultura a performantei.',
    cta: 'PROIECTE INOVATIVE',
  },
];

function HomePage() {
  return (
    <section className="page-shell home-page">
      <article className="home-hero">
        <img
          src={photoUrl('WhatsApp Image 2026-05-26 at 21.09.21.jpeg')}
          alt="Liceul Tehnologic Nr. 1"
          className="home-hero-image"
        />

        <div className="home-hero-overlay">
          <h1>
            <span>LICEUL</span>
            <span>TEHNOLOGIC</span>
            <span>NR. 1</span>
          </h1>
        </div>

        <div className="home-hero-banner">START ADMITERE 2026: INVATA O MESERIE DE VIITOR!</div>
      </article>

      <section className="home-intro">
        <article className="home-intro-story">
          <h2>DE CE SA ALEGI LICEUL TEHNOLOGIC NR. 1?</h2>
          <p>
            Cu traditie din 1873, Liceul Tehnologic Nr. 1 din Campulung Moldovenesc este o institutie
            de invatamant profesional si tehnic care imbina educatia teoretica cu deprinderile practice
            si valorile care formeaza caracterul. Ne asumam misiunea de a pregati tineri competenti,
            responsabili si adaptati cerintelor societatii moderne, pentru o cariera solida sau pentru
            continuarea studiilor.
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
          <Link to="/despre-noi#album-foto" className="home-intro-link is-purple">
            <span>03.</span>
            <strong>ALBUM FOTO</strong>
          </Link>
        </div>
      </section>

      <section className="home-stats" aria-label="Statistici liceu">
        {stats.map((item) => (
          <article key={item.label} className="home-stat-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="home-events">
        <h2>PRIORITATI SI DIRECTII 2025–2026</h2>

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

    </section>
  );
}

export default HomePage;
