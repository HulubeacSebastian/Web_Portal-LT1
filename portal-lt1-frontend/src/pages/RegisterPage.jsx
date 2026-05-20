import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateRegister } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const highlights = [
  'Creare rapida a unui cont local in portal',
  'Acces la documente, calendar si pagina Despre',
  'Datele contului sunt pastrate doar in browser',
];

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      recordActivityEvent('register_failed_validation');
      return;
    }

    setCookie('portal_user', formData.name.trim(), { maxAge: 60 * 60 * 24 * 7 });
    savePreference('lastRegisteredName', formData.name.trim());
    recordActivityEvent('register_success');
    navigate('/');
  };

  return (
    <AuthPageLayout
      variant="register"
      eyebrow="Cont nou"
      title="Creare cont portal"
      lead="Inregistreaza-te pentru a folosi functionalitatile personalizate ale platformei educationale."
      highlights={highlights}
      formTitle="Informatii cont"
      formLead="Completeaza datele de mai jos pentru a-ti crea contul."
      footer={
        <p className="auth-note">
          Ai deja cont? <Link to="/login">Autentifica-te</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className={`auth-field${errors.name ? ' has-error' : ''}`}>
          <label htmlFor="register-name">Nume</label>
          <input
            id="register-name"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="Nume si prenume"
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
          />
          {errors.name ? <p className="error">{errors.name}</p> : null}
        </div>

        <div className={`auth-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="register-email">Email/Username</label>
          <input
            id="register-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            placeholder="ex: elev@lt1.ro"
            maxLength={120}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>

        <div className={`auth-field${errors.password ? ' has-error' : ''}`}>
          <label htmlFor="register-password">Parola</label>
          <input
            id="register-password"
            type="password"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            placeholder="Minimum 6 caractere"
            maxLength={80}
            aria-invalid={Boolean(errors.password)}
            autoComplete="new-password"
          />
          {errors.password ? <p className="error">{errors.password}</p> : null}
        </div>

        <div className={`auth-field${errors.confirmPassword ? ' has-error' : ''}`}>
          <label htmlFor="register-confirm-password">Confirmare Parola</label>
          <input
            id="register-confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => handleChange('confirmPassword', event.target.value)}
            placeholder="Repeta parola"
            maxLength={80}
            aria-invalid={Boolean(errors.confirmPassword)}
            autoComplete="new-password"
          />
          {errors.confirmPassword ? <p className="error">{errors.confirmPassword}</p> : null}
        </div>

        <button type="submit" className="auth-submit auth-submit--register">
          <span>Creare cont</span>
          <small>Cont simulat pentru proiectul educational</small>
        </button>
      </form>
    </AuthPageLayout>
  );
}

export default RegisterPage;
