function AuthPageLayout({
  variant,
  eyebrow,
  title,
  lead,
  highlights = [],
  formTitle,
  formLead,
  children,
  footer
}) {
  return (
    <section className={`page-shell auth-page auth-page--${variant}`}>
      <header className="auth-hero" aria-labelledby="auth-hero-title">
        <div className="auth-hero-scrim" aria-hidden="true" />
        <div className="auth-hero-content">
          <div className={`auth-hero-copy${eyebrow ? '' : ' auth-hero-copy--no-eyebrow'}`}>
            {eyebrow ? <span className="auth-eyebrow">{eyebrow}</span> : null}
            <h1 id="auth-hero-title">{title}</h1>
            {lead ? <p className="auth-hero-lead">{lead}</p> : null}
          </div>
        </div>
      </header>

      <div className="auth-body">
        <aside className="auth-aside auth-reveal" aria-label="Beneficii portal">
          <h2>{highlights.length > 0 ? 'De ce un cont in portal?' : 'Portal LT1'}</h2>
          {highlights.length > 0 ? (
            <ul className="auth-highlight-list">
              {highlights.map((item, index) => (
                <li
                  key={item}
                  className={`auth-highlight-item auth-highlight-item--${index + 1}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className="auth-highlight-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="auth-highlight-text">{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="auth-aside-note">
            <span className="auth-aside-note-icon" aria-hidden="true" />
            Datele tale sunt protejate prin autentificare securizata si resetare controlata.
          </p>
        </aside>

        <div className="auth-card auth-reveal">
          <header className="auth-card-head">
            <h2>{formTitle}</h2>
            {formLead ? <p>{formLead}</p> : null}
          </header>
          {children}
          {footer ? <div className="auth-card-footer">{footer}</div> : null}
        </div>
      </div>
    </section>
  );
}

export default AuthPageLayout;
