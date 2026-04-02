import { useState } from 'react';
import SchoolFooter from '../components/SchoolFooter.jsx';

function ContactPage() {
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatusMessage('Mesajul a fost trimis cu succes.');
  };

  return (
    <section className="page-shell contact-page">
      <section className="contact-panel">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field">
            <label htmlFor="contact-name">Nume și Prenume</label>
            <input id="contact-name" type="text" placeholder="Introdu numele tău complet.." />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-email">Adresă de Email</label>
            <input id="contact-email" type="email" placeholder="Introdu adresa ta de email.." />
          </div>

          <div className="contact-field">
            <label htmlFor="contact-message">Mesajul Tău</label>
            <textarea
              id="contact-message"
              rows="8"
              placeholder="Scrie aici mesajul sau întrebarea ta pentru noi.."
            />
          </div>

          <button type="submit" className="contact-submit">
            TRIMITE
          </button>

          {statusMessage ? <p className="contact-status">{statusMessage}</p> : null}
        </form>
      </section>

      <SchoolFooter />
    </section>
  );
}

export default ContactPage;

