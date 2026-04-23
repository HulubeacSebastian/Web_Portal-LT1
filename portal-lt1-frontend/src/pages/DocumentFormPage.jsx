import { useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDocuments } from '../store/DocumentsContext';
import { hasErrors, validateDocument } from '../utils/documentValidation';

const defaultValues = {
  title: '',
  category: '',
  issuer: '',
  issuedAt: '',
  status: 'Activ',
  description: '',
  file: null
};

function DocumentFormPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addDocument, updateDocument, getDocumentById } = useDocuments();
  const fileInputRef = useRef(null);

  const existingDoc = useMemo(() => {
    if (mode !== 'edit') {
      return null;
    }
    return getDocumentById(id) ?? null;
  }, [getDocumentById, id, mode]);

  const [formData, setFormData] = useState(existingDoc ?? defaultValues);
  const [errors, setErrors] = useState({});
  const [isDropping, setIsDropping] = useState(false);

  if (mode === 'edit' && !existingDoc) {
    return (
      <section className="card">
        <h2>Document inexistent</h2>
        <p className="muted">Nu se poate edita un document care nu exista.</p>
        <Link to="/documente" className="btn secondary">
          Inapoi la lista
        </Link>
      </section>
    );
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setFormData((prev) => ({
        ...prev,
        file: dataUrl
          ? {
              name: file.name,
              type: file.type || 'application/octet-stream',
              size: file.size,
              dataUrl
            }
          : null
      }));
    };
    reader.readAsDataURL(file);
  };

  const clearFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedData = {
      ...formData,
      title: formData.title.trim(),
      category: formData.category.trim(),
      issuer: formData.issuer.trim(),
      description: formData.description.trim()
    };

    const nextErrors = validateDocument(normalizedData);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    if (mode === 'edit') {
      updateDocument(id, normalizedData);
      navigate(`/documente/${id}`);
      return;
    }

    const newId = addDocument(normalizedData);
    navigate(`/documente/${newId}`);
  };

  return (
    <section className="page-stack">
      <article className="card page-title-row">
        <div>
          <p className="eyebrow">Formular</p>
          <h2>{mode === 'edit' ? 'Editeaza document' : 'Adauga document nou'}</h2>
        </div>
      </article>

      <article className="card">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div>
              <label htmlFor="title">Titlu</label>
              <input
                id="title"
                value={formData.title}
                onChange={(event) => handleChange('title', event.target.value)}
                maxLength={120}
                aria-invalid={Boolean(errors.title)}
              />
              {errors.title ? <p className="error">{errors.title}</p> : null}
            </div>

            <div>
              <label htmlFor="category">Categorie</label>
              <input
                id="category"
                value={formData.category}
                onChange={(event) => handleChange('category', event.target.value)}
                maxLength={60}
                aria-invalid={Boolean(errors.category)}
              />
              {errors.category ? <p className="error">{errors.category}</p> : null}
            </div>

            <div>
              <label htmlFor="issuer">Emitent</label>
              <input
                id="issuer"
                value={formData.issuer}
                onChange={(event) => handleChange('issuer', event.target.value)}
                maxLength={80}
                aria-invalid={Boolean(errors.issuer)}
              />
              {errors.issuer ? <p className="error">{errors.issuer}</p> : null}
            </div>

            <div>
              <label htmlFor="issuedAt">Data emiterii</label>
              <input
                id="issuedAt"
                type="date"
                value={formData.issuedAt}
                onChange={(event) => handleChange('issuedAt', event.target.value)}
                aria-invalid={Boolean(errors.issuedAt)}
              />
              {errors.issuedAt ? <p className="error">{errors.issuedAt}</p> : null}
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(event) => handleChange('status', event.target.value)}
                aria-invalid={Boolean(errors.status)}
              >
                <option value="Activ">Activ</option>
                <option value="Revizie">Revizie</option>
                <option value="Arhivat">Arhivat</option>
              </select>
              {errors.status ? <p className="error">{errors.status}</p> : null}
            </div>
          </div>

          <div className="mt-12">
            <label htmlFor="description">Descriere</label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={(event) => handleChange('description', event.target.value)}
              maxLength={1000}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description ? <p className="error">{errors.description}</p> : null}
          </div>

          <div className="mt-12">
            <label>Fisier (drop / incarcare)</label>
            <div
              role="button"
              tabIndex={0}
              className={`upload-dropzone${isDropping ? ' is-dropping' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDropping(true);
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDropping(true);
              }}
              onDragLeave={() => setIsDropping(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDropping(false);
                const file = event.dataTransfer.files?.[0];
                handleFile(file);
              }}
              aria-label="Drop fisier aici sau click pentru incarcare"
            >
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept="application/pdf,image/*"
                onChange={(event) => handleFile(event.target.files?.[0])}
              />

              {formData.file ? (
                <div className="upload-dropzone-info">
                  <strong>{formData.file.name}</strong>
                  <span className="muted">
                    {Math.round((formData.file.size || 0) / 1024)} KB
                    {formData.file.type ? ` • ${formData.file.type}` : ''}
                  </span>
                </div>
              ) : (
                <div className="upload-dropzone-info">
                  <strong>Drop fisier aici</strong>
                  <span className="muted">sau click pentru a selecta (PDF / imagini)</span>
                </div>
              )}
            </div>

            {formData.file ? (
              <div className="row mt-8">
                <button type="button" className="btn secondary" onClick={clearFile}>
                  Elimina fisierul
                </button>
              </div>
            ) : null}
          </div>

          <div className="row mt-12">
            <button type="submit">{mode === 'edit' ? 'Salveaza modificarile' : 'Creeaza document'}</button>
            <Link to={mode === 'edit' ? `/documente/${id}` : '/documente'} className="btn ghost">
              Renunta
            </Link>
          </div>
        </form>
      </article>
    </section>
  );
}

export default DocumentFormPage;

