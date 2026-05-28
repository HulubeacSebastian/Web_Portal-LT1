import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../store/DocumentsContext';

const statusPalette = {
  Activ: '#bfd4e6',
  Revizie: '#7f648f',
  Arhivat: '#a78bfa',
};

function parseDateLoose(value) {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  const text = String(value).trim();
  if (!text) return null;

  // yyyy-mm-dd or iso
  const iso = new Date(text);
  if (!Number.isNaN(iso.getTime())) return iso;

  // dd.mm.yyyy
  const m1 = text.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m1) {
    const day = Number(m1[1]);
    const month = Number(m1[2]) - 1;
    const year = Number(m1[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // dd/mm/yyyy
  const m2 = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) {
    const day = Number(m2[1]);
    const month = Number(m2[2]) - 1;
    const year = Number(m2[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  return null;
}

function addYears(date, years) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function formatDateRo(date) {
  try {
    return new Intl.DateTimeFormat('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

function DocumentAnalyticsPage() {
  const { documents } = useDocuments();

  const statusStats = useMemo(() => {
    const counts = documents.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1;
        return acc;
      },
      { Activ: 0, Revizie: 0, Arhivat: 0 }
    );

    const total = Math.max(1, counts.Activ + counts.Revizie + counts.Arhivat);
    const gradient = [
      `${statusPalette.Activ} 0 ${(counts.Activ / total) * 100}%`,
      `${statusPalette.Revizie} ${(counts.Activ / total) * 100}% ${((counts.Activ + counts.Revizie) / total) * 100}%`,
      `${statusPalette.Arhivat} ${((counts.Activ + counts.Revizie) / total) * 100}% 100%`,
    ].join(', ');

    return { counts, gradient };
  }, [documents]);

  const categoryStats = useMemo(() => {
    const counts = documents.reduce((acc, doc) => {
      const key = (doc.category || 'Fara categorie').trim() || 'Fara categorie';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label, value]) => ({ label, value }));
  }, [documents]);

  const kpis = useMemo(() => {
    const total = Math.max(1, documents.length);
    const activePct = Math.round((statusStats.counts.Activ / total) * 100);
    const revPct = Math.round((statusStats.counts.Revizie / total) * 100);
    const archPct = Math.round((statusStats.counts.Arhivat / total) * 100);

    return [
      { title: 'Total documente', value: String(documents.length), hint: 'Inregistrari disponibile' },
      { title: 'Activ', value: `${activePct}%`, hint: `${statusStats.counts.Activ} documente` },
      { title: 'In revizie', value: `${revPct}%`, hint: `${statusStats.counts.Revizie} documente` },
      { title: 'Arhivate', value: `${archPct}%`, hint: `${statusStats.counts.Arhivat} documente` },
    ];
  }, [documents.length, statusStats.counts]);

  const expiringDocs = useMemo(() => {
    const now = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;

    const items = documents
      .map((doc) => {
        const explicit = parseDateLoose(doc.expiresAt || doc.expireAt || doc.dueAt);
        const issued = parseDateLoose(doc.issuedAt);
        const due = explicit || (issued ? addYears(issued, 1) : null);
        if (!due) return null;
        const daysLeft = Math.ceil((due.getTime() - now.getTime()) / msPerDay);
        return {
          id: doc.id,
          title: doc.title,
          due,
          daysLeft
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.due.getTime() - b.due.getTime());

    const upcoming = items.filter((it) => it.daysLeft <= 60);
    return (upcoming.length ? upcoming : items).slice(0, 8);
  }, [documents]);

  return (
    <section className="page-shell documents-page documents-analytics-page">
      <header className="documents-hero documents-hero--analytics" aria-labelledby="documents-analytics-title">
        <img
          src="/assets/Poze_liceu/contact-hero.jpg"
          alt=""
          className="documents-hero-media"
          aria-hidden="true"
        />
        <div className="documents-hero-scrim" aria-hidden="true" />
        <div className="documents-hero-content">
          <span className="documents-hero-badge">Analiza documentelor</span>
          <h1 id="documents-analytics-title">
            Documente <span className="documents-hero-title-gradient">statistici</span>
          </h1>
          <p className="documents-hero-lead">Distribuirea si evolutia documentelor incarcate.</p>
          <div className="documents-hero-tags" aria-label="Etichete statistici">
            <span className="documents-tag">Distribuire</span>
            <span className="documents-tag">Evolutie</span>
            <span className="documents-tag">Rapoarte</span>
          </div>
        </div>
      </header>

      <section className="documents-analytics-stage">
        <div className="documents-actions-bar documents-actions-bar--right" aria-label="Actiuni statistici">
          <Link to="/documente" className="btn ghost">
            Inapoi la documente
          </Link>
        </div>
        <div className="analytics-dashboard">
          <section className="analytics-kpis" aria-label="Indicatori rapizi">
            {kpis.map((kpi) => (
              <article key={kpi.title} className="analytics-kpi">
                <span className="analytics-kpi-title">{kpi.title}</span>
                <strong className="analytics-kpi-value">{kpi.value}</strong>
                <span className="analytics-kpi-hint">{kpi.hint}</span>
              </article>
            ))}
          </section>

          <section className="analytics-grid" aria-label="Grafice">
            <article className="analytics-card analytics-card--wide">
              <header className="analytics-card-head">
                <div>
                  <h2>Documente cu termen limită de actualizare</h2>
                  <p className="muted">Recomandare: actualizeaza documentele inainte de data limita.</p>
                </div>
              </header>

              <div className="analytics-expiring" aria-label="Lista documente de actualizat">
                <div className="analytics-expiring-head" aria-hidden="true">
                  <span>Document</span>
                  <span>Actualizare pana la</span>
                </div>

                {expiringDocs.length === 0 ? (
                  <p className="muted">Nu exista documente cu data de emitere / expirare.</p>
                ) : (
                  <ol className="analytics-expiring-list">
                    {expiringDocs.map((item) => (
                      <li key={item.id} className="analytics-expiring-item">
                        <span className="analytics-expiring-title">{item.title}</span>
                        <span className="analytics-expiring-date">
                          {formatDateRo(item.due)}
                          <em className={`analytics-expiring-days${item.daysLeft < 0 ? ' is-overdue' : item.daysLeft <= 14 ? ' is-soon' : ''}`}>
                            {item.daysLeft < 0
                              ? `Depasit cu ${Math.abs(item.daysLeft)} zile`
                              : item.daysLeft === 0
                                ? 'Astazi'
                                : `${item.daysLeft} zile`}
                          </em>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </article>

            <article className="analytics-card">
              <header className="analytics-card-head">
                <div>
                  <h2>Distribuire pe status</h2>
                  <p className="muted">Activ / Revizie / Arhivat.</p>
                </div>
              </header>

              <div className="analytics-donut-wrap">
                <div
                  className="analytics-donut"
                  style={{ background: `conic-gradient(${statusStats.gradient})` }}
                  role="img"
                  aria-label="Distribuire documente dupa status"
                />
                <div className="analytics-donut-center" aria-hidden="true">
                  <strong>{documents.length}</strong>
                  <span>documente</span>
                </div>
              </div>

              <ul className="analytics-mini-legend" aria-label="Legenda status">
                {['Activ', 'Revizie', 'Arhivat'].map((key) => (
                  <li key={key}>
                    <i style={{ background: statusPalette[key] }} />
                    <span>{key}</span>
                    <strong>{statusStats.counts[key]}</strong>
                  </li>
                ))}
              </ul>
            </article>

            <article className="analytics-card">
              <header className="analytics-card-head">
                <div>
                  <h2>Top categorii</h2>
                  <p className="muted">Cele mai folosite categorii.</p>
                </div>
              </header>

              <ol className="analytics-list" aria-label="Top categorii">
                {categoryStats.length === 0 ? (
                  <li className="muted">Nu exista date.</li>
                ) : (
                  categoryStats.map((item) => (
                    <li key={item.label} className="analytics-list-item">
                      <span className="analytics-list-label">{item.label}</span>
                      <span className="analytics-list-pill">{item.value}</span>
                    </li>
                  ))
                )}
              </ol>
            </article>
          </section>
        </div>
      </section>
    </section>
  );
}

export default DocumentAnalyticsPage;

