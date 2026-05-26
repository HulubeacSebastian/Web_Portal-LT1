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
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1 id="auth-hero-title">{title}</h1>
          <p className="auth-hero-lead">{lead}</p>
        </div>
      </header>

      <div className="auth-body">
        <aside className="auth-aside auth-reveal" aria-label="Beneficii portal">
          <h2>{highlights.length > 0 ? 'De ce un cont in portal?' : 'Portal LT1'}</h2>
          {highlights.length > 0 ? (
            <ul className="auth-highlight-list">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <p className="auth-aside-note">
            Recuperarea parolei foloseste token securizat pe server (Assignment 4).
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
