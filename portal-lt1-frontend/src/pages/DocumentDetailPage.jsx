import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '../store/DocumentsContext';
import { hasPermission } from '../utils/authSession';
import { resolveDocumentFileUrl } from '../utils/documentFileUrl';

function DocumentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocumentById, deleteDocument } = useDocuments();

  const document = getDocumentById(id);
  const canUpdate = hasPermission('documents:update');
  const canDelete = hasPermission('documents:delete');

  if (!document) {
    return (
      <section className="card">
        <h2>Document inexistent</h2>
        <p className="muted">Documentul cautat nu exista sau a fost deja sters.</p>
        <Link to="/documente" className="btn secondary documents-back-btn">
          Inapoi la lista
        </Link>
      </section>
    );
  }

  const handleDelete = () => {
    const confirmed = window.confirm('Esti sigur ca vrei sa stergi acest document?');
    if (!confirmed) {
      return;
    }

    deleteDocument(document.id);
    navigate('/documente');
  };

  const fileHref = resolveDocumentFileUrl(document);
  const fileName = document.file?.name || document.file_path?.split('/').pop() || 'document';
  const isPdf =
    (document.file?.type || '').toLowerCase() === 'application/pdf' ||
    fileHref.toLowerCase().includes('.pdf');

  return (
    <section className="page-stack documents-page">
      <article className="card page-title-row">
        <div>
          <p className="eyebrow">Document</p>
          <h2>{document.title}</h2>
        </div>
        {canUpdate || canDelete ? (
          <div className="actions">
            {canUpdate ? (
              <Link to={`/documente/${document.id}/edit`} className="btn secondary">
                Editeaza
              </Link>
            ) : null}
            {canDelete ? (
              <button type="button" className="danger" onClick={handleDelete}>
                Sterge
              </button>
            ) : null}
          </div>
        ) : null}
      </article>

      <article className="card detail-grid">
        <p>
          <strong>ID:</strong> {document.id}
        </p>
        <p>
          <strong>Categorie:</strong> {document.category}
        </p>
        <p>
          <strong>Emitent:</strong> {document.issuer}
        </p>
        <p>
          <strong>Data emiterii:</strong> {document.issuedAt}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status-pill status-${document.status.toLowerCase()}`}>{document.status}</span>
        </p>
        {fileHref ? (
          <div className="detail-file-cta">
            <a
              className="btn detail-file-btn"
              href={fileHref}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName}
            >
              <span className="detail-file-btn-icon" aria-hidden="true">
                ⤓
              </span>
              <span className="detail-file-btn-text">Vezi fisierul</span>
            </a>
          </div>
        ) : null}
      </article>

      <article className="card">
        <h3>Descriere</h3>
        <p>{document.description}</p>
      </article>

      {fileHref && isPdf ? (
        <article className="card">
          <h3>Previzualizare</h3>
          <iframe
            title="Previzualizare document"
            src={fileHref}
            style={{ width: '100%', height: 640, border: '1px solid #e5e7eb', borderRadius: 12 }}
          />
        </article>
      ) : null}

      <Link to="/documente" className="btn ghost documents-back-btn">
        Inapoi la lista
      </Link>
    </section>
  );
}

export default DocumentDetailPage;
