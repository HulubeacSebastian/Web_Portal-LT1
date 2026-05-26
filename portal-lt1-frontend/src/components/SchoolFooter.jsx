import { Link } from 'react-router-dom';

const QUICK_LINKS = [
  { to: '/', label: 'Acasă' },
  { to: '/documente', label: 'Documente' },
  { to: '/despre-noi', label: 'Despre Noi' },
  { to: '/contact', label: 'Contact' },
  { to: '/calendar', label: 'Calendar' }
];

function SchoolFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="school-footer">
      <div className="school-footer-ribbon" aria-hidden="true" />

      <div className="school-footer-award">
        <p className="school-footer-award-line">MINISTERUL EDUCAȚIEI</p>
        <p className="school-footer-award-line school-footer-award-line--emph">
          INSPECTORATUL ȘCOLAR JUDEȚEAN SUCEAVA
        </p>
      </div>

      <div className="school-footer-body">
        <div className="school-footer-col school-footer-col--brand">
          <div className="school-footer-brand">
            <img
              src="/assets/logo-mov-vector.pdf.png"
              alt="Liceul Tehnologic Nr. 1"
              className="school-footer-logo"
            />
            <div className="school-footer-brand-text">
              <strong>LICEUL TEHNOLOGIC NR. 1</strong>
              <span>Câmpulung Moldovenesc · jud. Suceava</span>
            </div>
          </div>
          <p className="school-footer-tagline">
            Educație tehnică de calitate, comunitate activă, viitor pregătit.
          </p>
        </div>

        <div className="school-footer-col school-footer-col--links">
          <h3 className="school-footer-heading">Navigare rapidă</h3>
          <ul className="school-footer-links">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="school-footer-col school-footer-col--contact">
          <h3 className="school-footer-heading">Contact</h3>
          <ul className="school-footer-contact">
            <li>
              <span className="school-footer-contact-label">Adresă</span>
              Calea Transilvaniei, Nr. 55, 725100, Câmpulung Moldovenesc
            </li>
            <li>
              <span className="school-footer-contact-label">Telefon</span>
              <a href="tel:+40230311382">+40 230 311 382</a>
              <span className="school-footer-contact-sep">·</span>
              <span className="school-footer-contact-label school-footer-contact-label--inline">Fax</span>
              <a href="tel:+40230312912">+40 230 312 912</a>
            </li>
            <li>
              <span className="school-footer-contact-label">Email</span>
              <a href="mailto:liceultehnologic1cm@yahoo.ro">liceultehnologic1cm@yahoo.ro</a>
            </li>
            <li>
              <span className="school-footer-contact-label">Web</span>
              <a href="https://www.liceultehnologicnr1.ro" target="_blank" rel="noopener noreferrer">
                www.liceultehnologicnr1.ro
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="school-footer-bottom">
        <p>© {year} Liceul Tehnologic Nr. 1 Câmpulung Moldovenesc. Toate drepturile rezervate.</p>
        <p className="school-footer-bottom-note">Portal educațional — documente, calendar și comunicare.</p>
      </div>
    </footer>
  );
}

export default SchoolFooter;
