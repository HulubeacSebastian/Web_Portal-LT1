import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocuments } from '../store/DocumentsContext';
import { getCookie, setCookie } from '../utils/cookies';

const PAGE_SIZE = 5;

function DocumentListPage() {
  const { documents } = useDocuments();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Toate');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(() => getCookie('portal_last_document') || documents[0]?.id || '');
  const [viewMode, setViewMode] = useState(() => getCookie('portal_view_mode') || 'table');

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

  const handleFilterChange = (value, setter) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    setCookie('portal_view_mode', viewMode, { maxAge: 60 * 60 * 24 * 30 });
  }, [viewMode]);

  useEffect(() => {
    if (selectedDoc && selectedDoc.id !== selectedId) {
      setSelectedId(selectedDoc.id);
    }
  }, [selectedDoc, selectedId]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'table' ? 'cards' : 'table'));
  };

  return (
    <section className="documents-page">
      <article className="documents-title-card">
        <h2>DOCUMENTE SCOLARE</h2>
        <p className="documents-subtitle">SCHIMBA VIZUALIZARE</p>
        <Link to="/documente2" className="view-toggle" aria-label="Schimba vizualizare" />
      </article>

      <div className="documents-stage">
        <div className="documents-grid">
          <article className="card documents-card documents-master-card">
            <div className="row space-between documents-toolbar-head">
              <div className="toolbar-grid toolbar-grid-docs">
                <div>
                  <label htmlFor="search">Cautare</label>
                  <input
                    id="search"
                    value={query}
                    onChange={(event) => handleFilterChange(event.target.value, setQuery)}
                    placeholder="Titlu, categorie sau emitent"
                  />
                </div>
                <div>
                  <label htmlFor="status">Status</label>
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
                </div>
              </div>
              <button type="button" className="btn documents-add-btn view-toggle-btn" onClick={toggleViewMode}>
                {viewMode === 'table' ? 'CARDURI' : 'TABEL'}
              </button>
              <Link to="/documente/adauga" className="btn documents-add-btn">
                ADAUGARE
              </Link>
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
                        <tr key={doc.id} className={selectedId === doc.id ? 'is-selected' : ''}>
                          <td>
                            <button type="button" className="table-link" onClick={() => setSelectedId(doc.id)}>
                              {doc.title}
                            </button>
                          </td>
                          <td>{doc.issuer}</td>
                          <td>
                            <span className={`status-pill status-${doc.status.toLowerCase()}`}>{doc.status}</span>
                          </td>
                          <td>
                            <div className="actions">
                              <Link to={`/documente/${doc.id}`} className="btn ghost">
                                Vezi
                              </Link>
                              <Link to={`/documente/${doc.id}/edit`} className="btn secondary">
                                Editeaza
                              </Link>
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
                      onClick={() => setSelectedId(doc.id)}
                    >
                      <strong>{doc.title}</strong>
                      <span>{doc.issuer}</span>
                      <span className={`status-pill status-${doc.status.toLowerCase()}`}>{doc.status}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            <div className="pagination space-between">
              <button
                type="button"
                className="secondary"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
              >
                Inapoi
              </button>
              <span className="muted">
                Pagina {safePage} din {maxPage}
              </span>
              <button
                type="button"
                className="secondary"
                onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
                disabled={safePage === maxPage}
              >
                Inainte
              </button>
            </div>
          </article>

          <aside className="card documents-detail-card">
            <p className="eyebrow">Master detail</p>
            <h3>{selectedDoc ? selectedDoc.title : 'Nu exista document selectat'}</h3>
            {selectedDoc ? (
              <>
                <p className="muted">{selectedDoc.category}</p>
                <p>
                  <strong>Creat de:</strong> {selectedDoc.issuer}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-pill status-${selectedDoc.status.toLowerCase()}`}>{selectedDoc.status}</span>
                </p>
                <p>
                  <strong>Data:</strong> {selectedDoc.issuedAt}
                </p>
                <p className="documents-detail-description">{selectedDoc.description}</p>
                <div className="actions">
                  <Link to={`/documente/${selectedDoc.id}`} className="btn ghost">
                    Deschide
                  </Link>
                  <Link to={`/documente/${selectedDoc.id}/edit`} className="btn secondary">
                    Editeaza
                  </Link>
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

      <img src="/assets/antet2@4x.png" alt="Antet liceu" className="documents-antet" />
    </section>
  );
}

export default DocumentListPage;

