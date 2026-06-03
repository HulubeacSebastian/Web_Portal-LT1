import { useState } from 'react';
import { Link } from 'react-router-dom';
import { hasErrors } from '../utils/documentValidation';
import { validateContact } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';
import { apiRequest } from '../utils/apiClient';
import { hasAuthSession } from '../utils/authSession';

const contactChannels = [
  {
    label: 'Adresa',
    value: 'Calea Transilvaniei, Nr. 55, 725100, Campulung Moldovenesc, jud. Suceava',
    hint: 'Sediul liceului',
    href: 'https://www.google.com/maps/search/?api=1&query=Calea+Transilvaniei+55+Campulung+Moldovenesc',
    external: true,
  },
  {
    label: 'Telefon',
    value: '+40 230 311 382',
    hint: 'Secretariat — fax: +40 230 312 912',
    href: 'tel:+40230311382',
  },
  {
    label: 'Email',
    value: 'liceultehnologic1cm@yahoo.ro',
    hint: 'Raspundem in 1–2 zile lucratoare',
    href: 'mailto:liceultehnologic1cm@yahoo.ro',
  },
  {
    label: 'Website',
    value: 'www.liceultehnologicnr1.ro',
    hint: 'Informatii oficiale despre scoala',
    href: 'https://www.liceultehnologicnr1.ro',
    external: true,
  },
];

const quickLinksBase = [
  { to: '/documente', label: 'Documente scolare' },
  { to: '/calendar', label: 'Calendar evenimente', authOnly: true },
  { to: '/despre-noi', label: 'Despre liceu' }
];

function ContactPage() {
  const quickLinks = quickLinksBase.filter((link) => !link.authOnly || hasAuthSession());
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (statusMessage) {
      setStatusMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateContact(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setStatusMessage('');
      recordActivityEvent('contact_failed_validation');
      return;
    }

    try {
      savePreference('lastContactEmail', formData.email.trim());
      await apiRequest('/api/contact', {
        method: 'POST',
        auth: false,
        body: {
          sender_name: formData.name,
          sender_email: formData.email,
          message: formData.message
        }
      });
      recordActivityEvent('contact_success');
      setStatusMessage('Mesajul a fost trimis cu succes.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      recordActivityEvent('contact_failed_network');
      setStatusMessage(error?.message || 'Nu se poate trimite mesajul momentan.');
    }
  };

  const statusClassName = statusMessage.includes('succes') ? ' is-success' : ' is-error';

  return (
    <section className="page-shell contact-page">
      <header className="contact-hero" aria-labelledby="contact-hero-title">
        <img
          src="/assets/Poze_liceu/WhatsApp%20Image%202026-05-26%20at%2021.09.21.jpeg"
          alt=""
          className="contact-hero-media"
          aria-hidden="true"
        />
        <div className="contact-hero-scrim" aria-hidden="true" />
        <div className="contact-hero-content">
          <span className="contact-hero-badge">Suport si informatii</span>
          <h1 id="contact-hero-title">
            <span className="contact-hero-title-gradient">Contacteaza liceul</span>
          </h1>
          <p className="contact-hero-lead">
            Trimite-ne un mesaj pentru admitere, documente sau intrebari generale. Echipa noastra te
            ghideaza catre informatia potrivita.
          </p>
          <div className="contact-hero-chips" aria-hidden="true">
            <span>Secretariat</span>
            <span>Program</span>
            <span>Intrebari</span>
          </div>
        </div>
      </header>

      <div className="contact-body">
        <aside className="contact-aside contact-reveal" aria-label="Date de contact">
          <div className="contact-aside-intro">
            <h2>Date de contact</h2>
            <p>Ne poti vizita la sediu sau ne poti scrie direct prin formularul din dreapta.</p>
          </div>

          <ul className="contact-channel-list">
            {contactChannels.map((channel) => (
              <li key={channel.label}>
                <article className="contact-channel-card">
                  <span className="contact-channel-label">{channel.label}</span>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="contact-channel-value"
                      {...(channel.external
                        ? { target: '_blank', rel: 'noreferrer noopener' }
                        : {})}
                    >
                      {channel.value}
                    </a>
                  ) : (
                    <p className="contact-channel-value">{channel.value}</p>
                  )}
                  <span className="contact-channel-hint">{channel.hint}</span>
                </article>
              </li>
            ))}
          </ul>

          <div className="contact-hours">
            <h3>Program secretariat</h3>
            <p>Luni – Vineri: 08:00 – 16:00</p>
            <p>Sambata – Duminica: inchis</p>
          </div>

          <nav className="contact-quick-links" aria-label="Linkuri utile">
            <span>Linkuri utile</span>
            <ul>
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="contact-form-panel contact-reveal">
          <header className="contact-form-head">
            <h2>Trimite un mesaj</h2>
            <p>Completeaza formularul si iti vom raspunde cat mai curand.</p>
          </header>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className={`contact-field${errors.name ? ' has-error' : ''}`}>
              <label htmlFor="contact-name">Nume și Prenume</label>
              <input
                id="contact-name"
                type="text"
                value={formData.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Introdu numele tau complet.."
                maxLength={80}
                aria-invalid={Boolean(errors.name)}
                autoComplete="name"
              />
              {errors.name ? <p className="error">{errors.name}</p> : null}
            </div>

            <div className={`contact-field${errors.email ? ' has-error' : ''}`}>
              <label htmlFor="contact-email">Adresă de Email</label>
              <input
                id="contact-email"
                type="email"
                value={formData.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="Introdu adresa ta de email.."
                maxLength={120}
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
              />
              {errors.email ? <p className="error">{errors.email}</p> : null}
            </div>

            <div className={`contact-field${errors.message ? ' has-error' : ''}`}>
              <div className="contact-field-top">
                <label htmlFor="contact-message">Mesajul Tău</label>
                <span className="contact-char-count" aria-live="polite">
                  {formData.message.length}/1000
                </span>
              </div>
              <textarea
                id="contact-message"
                rows="7"
                value={formData.message}
                onChange={(event) => handleChange('message', event.target.value)}
                placeholder="Scrie aici mesajul sau intrebarea ta pentru noi.."
                maxLength={1000}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message ? <p className="error">{errors.message}</p> : null}
            </div>

            <button type="submit" className="contact-submit">
              <span>TRIMITE</span>
              <small>Mesajul este trimis prin email catre secretariat</small>
            </button>

            {statusMessage ? (
              <p className={`contact-status${statusClassName}`} role="status">
                {statusMessage}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactPage;
