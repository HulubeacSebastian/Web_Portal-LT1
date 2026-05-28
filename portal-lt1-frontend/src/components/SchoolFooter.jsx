import { SCHOOL_FOOTER_LINKS } from '../config/schoolFooterLinks.js';

function FooterLinkIcon({ type }) {
  if (type === 'facebook') {
    return (
      <svg className="school-footer-social-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V9.1c0-.9.2-1.5 1.5-1.5H16.7V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.4H8.2v3.1h2.3v8h3z" />
      </svg>
    );
  }

  if (type === 'instagram') {
    return (
      <svg className="school-footer-social-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8zm9.2 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
      </svg>
    );
  }

  if (type === 'tiktok') {
    return (
      <svg className="school-footer-social-icon-svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.5 7.1c-1.3-.8-2.2-2.2-2.4-3.7V3h-3.5v12c0 1.6-1.3 2.9-2.9 2.9S5.8 16.6 5.8 15s1.3-2.9 2.9-2.9c.3 0 .6 0 .9.1V8.7c-.3 0-.6-.1-.9-.1-3.6 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4V9.8c1.3.9 2.9 1.4 4.6 1.4V7.8c-.8 0-1.7-.2-2.4-.7z" />
      </svg>
    );
  }

  return (
    <svg className="school-footer-social-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12h18M12 3c2.5 2.8 3.8 5.6 3.8 9s-1.3 6.2-3.8 9M12 3c-2.5 2.8-3.8 5.6-3.8 9s1.3 6.2 3.8 9" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function SchoolFooter() {
  const year = new Date().getFullYear();
  const mapsHref =
    'https://www.google.com/maps/search/?api=1&query=Liceul%20Tehnologic%20Nr.%201%20C%C3%A2mpulung%20Moldovenesc';

  return (
    <footer className="school-footer">
      <div className="school-footer-top">
        <p className="school-footer-ministry-line">
          <span className="school-footer-ministry">Ministerul Educației</span>
          <span className="school-footer-ministry-sep" aria-hidden="true">
            ·
          </span>
          <span className="school-footer-ministry school-footer-ministry--sub">
            Inspectoratul Școlar Județean Suceava
          </span>
        </p>
      </div>

      <div className="school-footer-main">
        <section className="school-footer-block school-footer-block--location" aria-labelledby="footer-location">
          <h3 id="footer-location" className="school-footer-heading">
            Locație
          </h3>
          <p className="school-footer-location-line">Câmpulung Moldovenesc, jud. Suceava</p>
          <a className="school-footer-map-link" href={mapsHref} target="_blank" rel="noopener noreferrer">
            Vezi pe hartă
          </a>
        </section>

        <section className="school-footer-block school-footer-block--brand" aria-labelledby="footer-brand">
          <h2 id="footer-brand" className="visually-hidden">
            Liceul Tehnologic Nr. 1
          </h2>
          <div className="school-footer-brand">
            <div className="school-footer-brand-text">
              <p className="school-footer-school-name">Liceul Tehnologic Nr. 1</p>
              <p className="school-footer-director">Director: Hulubeac Angela-Elena</p>
            </div>
          </div>
        </section>

        <div className="school-footer-side">
          {SCHOOL_FOOTER_LINKS.length > 0 ? (
            <nav className="school-footer-block" aria-labelledby="footer-social">
              <h3 id="footer-social" className="school-footer-heading">
                Liceul online
              </h3>
              <ul className="school-footer-social">
                {SCHOOL_FOOTER_LINKS.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      className={`school-footer-social-link school-footer-social-link--${item.icon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={`school-footer-social-icon school-footer-social-icon--${item.icon}`}>
                        <FooterLinkIcon type={item.icon} />
                      </span>
                      <span className="school-footer-social-label">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>

      <div className="school-footer-bottom">
        <p>© {year} Liceul Tehnologic Nr. 1 Câmpulung Moldovenesc.</p>
        <p className="school-footer-bottom-note">Portal educațional — documente, calendar și comunicare</p>
      </div>
    </footer>
  );
}

export default SchoolFooter;
