import { useState } from 'react';
import { hasErrors } from '../utils/documentValidation';
import { validateContact } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateContact(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setStatusMessage('');
      recordActivityEvent('contact_failed_validation');
      return;
    }

    savePreference('lastContactEmail', formData.email.trim());
    recordActivityEvent('contact_success');
    setStatusMessage('Mesajul a fost trimis cu succes.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section className="page-shell contact-page">
      <section className="contact-panel">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor="contact-name">Nume și Prenume</label>
            <input
              id="contact-name"
              type="text"
              value={formData.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Introdu numele tau complet.."
              maxLength={80}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <p className="error">{errors.name}</p> : null}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">Adresă de Email</label>
            <input
              id="contact-email"
              type="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="Introdu adresa ta de email.."
              maxLength={120}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <p className="error">{errors.email}</p> : null}
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Mesajul Tău</label>
            <textarea
              id="contact-message"
              rows="8"
              value={formData.message}
              onChange={(event) => handleChange('message', event.target.value)}
              placeholder="Scrie aici mesajul sau intrebarea ta pentru noi.."
              maxLength={1000}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? <p className="error">{errors.message}</p> : null}
          </div>

          <button type="submit" className="contact-submit">
            TRIMITE
          </button>

          {statusMessage ? <p className="contact-status">{statusMessage}</p> : null}
        </form>
      </section>
    </section>
  );
}

export default ContactPage;

