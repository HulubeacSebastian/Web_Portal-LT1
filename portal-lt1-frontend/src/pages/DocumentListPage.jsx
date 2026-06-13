import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../store/DocumentsContext';
import { getCookie, setCookie } from '../utils/cookies';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';
import { hasPermission } from '../utils/authSession';

const PAGE_SIZE = 10;
const statusPalette = {
  Activ: '#dcfce7',
  Revizie: '#fef3c7',
  Arhivat: '#e2e8f0'
};

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return Boolean(window.matchMedia?.('(max-width: 640px)')?.matches);
}

function DocumentListPage() {
  const { documents, documentsReady, deleteDocument, generator, isOffline, startGenerator, stopGenerator } =
    useDocuments();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Toate');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(() => getCookie('portal_last_document') || documents[0]?.id || '');
  const [viewMode, setViewMode] = useState(() => {
    const cookie = getCookie('portal_view_mode');
    if (cookie === 'table' || cookie === 'cards') return cookie;
    return isMobileViewport() ? 'cards' : 'table';
  });
  const isLoggedIn = Boolean(getCookie('portal_user'));
  const canCreate = hasPermission('documents:create');
  const canUpdate = hasPermission('documents:update');
  const canDelete = hasPermission('documents:delete');
  const canControlGenerator = hasPermission('generator:control');
  const [generatorBusy, setGeneratorBusy] = useState(false);

  const filteredDocs = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return documents.filter((doc) => {
      const matchesQuery =
        normalized.length === 0 ||
        doc.title.toLowerCase().includes(normalized) ||
        doc.category.toLowerCase().includes(normalized) ||
        doc.issuer.toLowerCase().includes(normalized);

      const matchesStatus = status === 'Toate' || doc.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [documents, query, status]);

  const maxPage = Math.max(1, Math.ceil(filteredDocs.length / PAGE_SIZE));
  const safePage = Math.min(page, maxPage);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageDocs = filteredDocs.slice(start, start + PAGE_SIZE);
  const selectedDoc = useMemo(
    () => documents.find((doc) => doc.id === selectedId) || filteredDocs[0] || documents[0] || null,
    [documents, filteredDocs, selectedId]
  );
  const statusCounts = useMemo(
    () =>
      documents.reduce(
        (acc, doc) => {
          acc[doc.status] = (acc[doc.status] || 0) + 1;
          return acc;
        },
        { Activ: 0, Revizie: 0, Arhivat: 0 }
      ),
    [documents]
  );
  const totalDocs = documents.length || 1;
  const analyticsStats = useMemo(() => {
    const total = Math.max(1, statusCounts.Activ + statusCounts.Revizie + statusCounts.Arhivat);
    const gradient = [
      `${statusPalette.Activ} 0 ${(statusCounts.Activ / total) * 100}%`,
      `${statusPalette.Revizie} ${(statusCounts.Activ / total) * 100}% ${((statusCounts.Activ + statusCounts.Revizie) / total) * 100}%`,
      `${statusPalette.Arhivat} ${((statusCounts.Activ + statusCounts.Revizie) / total) * 100}% 100%`
    ].join(', ');
    return { gradient };
  }, [statusCounts]);

  const handleFilterChange = (value, setter) => {
    setter(value);
    setPage(1);
    recordActivityEvent('documents_filter_change', { value });
  };

  useEffect(() => {
    setCookie('portal_view_mode', viewMode, { maxAge: 60 * 60 * 24 * 30 });
    savePreference('documentsViewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    savePreference('documentsStatusFilter', status);
  }, [status]);

  useEffect(() => {
    savePreference('documentsSearch', query.trim());
  }, [query]);

  useEffect(() => {
    if (selectedId) {
      setCookie('portal_last_document', selectedId, { maxAge: 60 * 60 * 24 * 30 });
      savePreference('documentsSelectedId', selectedId);
    }
  }, [selectedId]);

  useEffect(() => {
    if (selectedDoc && selectedDoc.id !== selectedId) {
      setSelectedId(selectedDoc.id);
    }
  }, [selectedDoc, selectedId]);

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === 'table' ? 'cards' : 'table';
      recordActivityEvent('documents_view_mode_change', { from: prev, to: next });
      return next;
    });
  };

  const handleDeleteFromList = (id) => {
    const confirmed = window.confirm('Esti sigur ca vrei sa stergi acest document?');
    if (!confirmed) {
      return;
    }

    deleteDocument(id);
    recordActivityEvent('documents_delete_from_list', { id });
  };

  const handleGeneratorToggle = async () => {
    if (generatorBusy) return;
    setGeneratorBusy(true);
    try {
      if (generator?.running) {
        await stopGenerator();
        recordActivityEvent('generator_stop');
      } else {
        await startGenerator({ batchSize: 1, intervalMs: 3000 });
        recordActivityEvent('generator_start', { batchSize: 1, intervalMs: 3000 });
      }
    } finally {
      setGeneratorBusy(false);
    }
  };

  if (!documentsReady) {
    return (
      <section className="page-shell documents-page">
        <article className="card">
          <p className="muted">Se incarca documentele de pe server...</p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-shell documents-page">
      <header className="documents-hero" aria-labelledby="documents-hero-title">
        <img
          src="/assets/Poze_liceu/contact-hero.jpg"
          alt=""
          className="documents-hero-media"
          aria-hidden="true"
        />
        <div className="documents-hero-scrim" aria-hidden="true" />

        <div className="documents-hero-content">
          <span className="documents-hero-badge">Documente si formulare</span>
          <h1 id="documents-hero-title">
            Documente <span className="documents-hero-title-gradient">scolare</span>
          </h1>
          <p className="documents-hero-lead">
            Cauta rapid dupa titlu, categorie sau emitent, apoi deschide, editeaza sau adauga documente
            in functie de permisiuni.
          </p>
          <div className="documents-hero-tags" aria-label="Etichete documente">
            <span className="documents-tag">Cautare rapida</span>
            <span className="documents-tag">Status documente</span>
            <span className="documents-tag">Formulare &amp; regulamente</span>
          </div>
        </div>
      </header>

      <div className="documents-body">
        <div className="documents-actions-bar" aria-label="Actiuni documente">
          <div className="documents-toggle-group" role="group" aria-label="Comenzi vizualizare">
            <Link to="/documente2" className="documents-toggle">
              <span className="documents-toggle-icon documents-toggle-icon--stats" aria-hidden="true" />
              <span>Statistici</span>
            </Link>
            <button type="button" className="documents-toggle" onClick={toggleViewMode}>
              <span className="documents-toggle-icon documents-toggle-icon--view" aria-hidden="true" />
              <span>{viewMode === 'table' ? 'Vezi: Carduri' : 'Vezi: Tabel'}</span>
            </button>
          </div>
          {isLoggedIn && canCreate ? (
            <Link to="/documente/adauga" className="btn documents-action-accent">
              Adaugare
            </Link>
          ) : null}
        </div>
        <div className="documents-grid">
          <article className="documents-panel documents-master-card" aria-label="Lista documente">
            <div className="row space-between documents-toolbar-head">
              <div className="toolbar-grid toolbar-grid-docs">
                <div>
                  <label htmlFor="search">Cautare</label>
                  <div className="docs-field docs-field--search">
                    <span className="docs-field-icon docs-field-icon--search" aria-hidden="true" />
                    <input
                      id="search"
                      value={query}
                      onChange={(event) => handleFilterChange(event.target.value, setQuery)}
                      placeholder="Titlu, categorie sau emitent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status">Status</label>
                  <div className="docs-field docs-field--select">
                    <select
                      id="status"
                      value={status}
                      onChange={(event) => handleFilterChange(event.target.value, setStatus)}
                    >
                      <option value="Toate">Toate</option>
                      <option value="Activ">Activ</option>
                      <option value="Revizie">Revizie</option>
                      <option value="Arhivat">Arhivat</option>
                    </select>
                    <span className="docs-field-caret" aria-hidden="true" />
                  </div>
                </div>
              </div>
              {canControlGenerator ? (
                <button
                  type="button"
                  className={`btn ${generator?.running ? 'danger' : 'secondary'}`}
                  onClick={handleGeneratorToggle}
                  disabled={isOffline || generatorBusy}
                  title={isOffline ? 'Backend offline - generator indisponibil.' : 'Porneste/opreste generatorul de documente.'}
                >
                  {generator?.running ? 'STOP GENERATOR' : 'START GENERATOR'}
                </button>
              ) : null}
            </div>

            {viewMode === 'table' ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Titlu document</th>
                      <th>Creat de</th>
                      <th>Status</th>
                      <th>Actiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageDocs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="muted">
                          Nu exista rezultate pentru filtrele curente.
                        </td>
                      </tr>
                    ) : (
                      pageDocs.map((doc) => (
                        <tr
                          key={doc.id}
                          className={`documents-row${selectedId === doc.id ? ' is-selected' : ''}`}
                          onClick={() => {
                            setSelectedId(doc.id);
                            recordActivityEvent('documents_select_row', { id: doc.id });
                          }}
                        >
                          <td>
                              <button
                                type="button"
                                className="table-link"
                                onClick={() => {
                                  // keep explicit click target, but row is clickable too
                                  setSelectedId(doc.id);
                                  recordActivityEvent('documents_select_row', { id: doc.id });
                                }}
                              >
                              {doc.title}
                            </button>
                          </td>
                          <td>{doc.issuer}</td>
                          <td>
                            <span className={`status-pill status-${doc.status.toLowerCase()}`}>
                              <span className="status-pill-dot" aria-hidden="true" />
                              <span className="status-pill-icon" aria-hidden="true" />
                              <span className="status-pill-text">{doc.status}</span>
                            </span>
                          </td>
                          <td>
                            <div className="actions">
                              <Link to={`/documente/${doc.id}`} className="btn ghost btn-icon-left">
                                <span className="btn-icon btn-icon--view" aria-hidden="true" />
                                Vezi
                              </Link>
                              {isLoggedIn && canUpdate ? (
                                <Link to={`/documente/${doc.id}/edit`} className="btn secondary">
                                  Editeaza
                                </Link>
                              ) : null}
                              {isLoggedIn && canDelete ? (
                                <button
                                  type="button"
                                  className="btn danger"
                                  onClick={() => handleDeleteFromList(doc.id)}
                                >
                                  Sterge
                                </button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="document-cards">
                {pageDocs.length === 0 ? (
                  <p className="muted">Nu exista rezultate pentru filtrele curente.</p>
                ) : (
                  pageDocs.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      className={`document-card-item${selectedId === doc.id ? ' selected' : ''}`}
                      onClick={() => {
                        setSelectedId(doc.id);
                        recordActivityEvent('documents_select_card', { id: doc.id });
                      }}
                    >
                      <strong>{doc.title}</strong>
                      <div className="document-card-meta">
                        <span className="document-card-issuer">{doc.issuer}</span>
                        <span className="document-card-dot" aria-hidden="true">
                          •
                        </span>
                        <span className="document-card-category">{doc.category}</span>
                      </div>
                      <div className="document-card-foot">
                        <span className={`status-pill status-${doc.status.toLowerCase()}`}>
                          <span className="status-pill-dot" aria-hidden="true" />
                          <span className="status-pill-icon" aria-hidden="true" />
                          <span className="status-pill-text">{doc.status}</span>
                        </span>
                        <span className="document-card-date">{doc.issuedAt}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="pagination space-between">
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setPage((prev) => Math.max(1, prev - 1));
                  recordActivityEvent('documents_page_previous', { page: safePage });
                }}
                disabled={safePage === 1}
              >
                Inapoi
              </button>
              <span className="muted">
                Pagina {safePage} din {maxPage}
              </span>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setPage((prev) => Math.min(maxPage, prev + 1));
                  recordActivityEvent('documents_page_next', { page: safePage });
                }}
                disabled={safePage === maxPage}
              >
                Inainte
              </button>
            </div>
          </article>

          <aside className="documents-panel documents-detail-card" aria-label="Detalii document selectat">
            <div className="documents-detail-head">
              <div>
                <p className="eyebrow">Detalii</p>
                <h3 className="documents-detail-title">{selectedDoc ? selectedDoc.title : 'Nu exista document selectat'}</h3>
              </div>
              {selectedDoc ? (
                <span className={`status-pill status-${selectedDoc.status.toLowerCase()}`}>
                  <span className="status-pill-dot" aria-hidden="true" />
                  <span className="status-pill-icon" aria-hidden="true" />
                  <span className="status-pill-text">{selectedDoc.status}</span>
                </span>
              ) : null}
            </div>
            {selectedDoc ? (
              <>
                <p className="muted documents-detail-category">{selectedDoc.category}</p>
                <div className="documents-detail-meta">
                  <div className="documents-detail-meta-item">
                    <span className="documents-detail-meta-label">Creat de</span>
                    <strong className="documents-detail-meta-value">{selectedDoc.issuer}</strong>
                  </div>
                  <div className="documents-detail-meta-item">
                    <span className="documents-detail-meta-label">Data</span>
                    <strong className="documents-detail-meta-value">{selectedDoc.issuedAt}</strong>
                  </div>
                </div>
                <p className="documents-detail-description">{selectedDoc.description}</p>
                <div className="actions documents-detail-actions">
                  <Link to={`/documente/${selectedDoc.id}`} className="btn documents-detail-cta">
                    Deschide
                  </Link>
                  {isLoggedIn && canUpdate ? (
                    <Link to={`/documente/${selectedDoc.id}/edit`} className="btn secondary">
                      Editeaza
                    </Link>
                  ) : null}
                  {isLoggedIn && canDelete ? (
                    <button type="button" className="btn danger" onClick={() => handleDeleteFromList(selectedDoc.id)}>
                      Sterge
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className="documents-chart">
              {['Activ', 'Revizie', 'Arhivat'].map((key) => (
                <div key={key} className="documents-chart-row">
                  <span>{key}</span>
                  <div className="documents-chart-track">
                    <div
                      className={`documents-chart-fill status-${key.toLowerCase()}`}
                      style={{ width: `${Math.max((statusCounts[key] / totalDocs) * 100, 8)}%` }}
                    />
                  </div>
                  <strong>{statusCounts[key]}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

    </section>
  );
}

export default DocumentListPage;

