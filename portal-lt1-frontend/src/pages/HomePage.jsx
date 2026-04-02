import { Link } from 'react-router-dom';
import SchoolFooter from '../components/SchoolFooter.jsx';

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

function HomePage() {
  return (
    <section className="page-shell home-page">
      <article className="home-hero">
        <img src="/assets/poza_liceu.jpeg" alt="Liceul Tehnologic Nr. 1" className="home-hero-image" />

        <div className="home-hero-overlay">
          <h1>LICEUL TEHNOLOGIC NR. 1</h1>
        </div>

        <div className="home-hero-banner">START ADMITERE 2026: INVATA O MESERIE DE VIITOR!</div>
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
        {stats.map((item) => (
          <article key={item.label} className="home-stat-card">
            <p>{item.label}</p>
            <strong>{item.value}</strong>
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

      <SchoolFooter />
    </section>
  );
}

export default HomePage;
