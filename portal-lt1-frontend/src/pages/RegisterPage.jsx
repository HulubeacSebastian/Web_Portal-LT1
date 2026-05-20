import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import { apiRequest, AUTH_CHANGED_EVENT } from '../utils/apiClient';
import { saveAuthSession } from '../utils/authSession';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateRegister } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const highlights = [
  'Cont nou salvat securizat pe server',
  'Rol utilizator cu permisiuni restrictionate',
  'Autentificare automata dupa inregistrare',
];

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (message) {
      setMessage('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      recordActivityEvent('register_failed_validation');
      setMessage('');
      return;
    }

    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
      });

      saveAuthSession({ token: response.token, user: response.user });
      setCookie('portal_user', response.user.email, { maxAge: 60 * 60 * 24 * 7 });
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      savePreference('lastRegisteredName', formData.name.trim());
      recordActivityEvent('register_success');
      setMessage('Cont creat cu succes.');
      navigate('/');
    } catch (error) {
      recordActivityEvent('register_failed_validation');
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage(error?.message || 'Inregistrarea a esuat. Incearca din nou.');
    }
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

        {message ? <p className="auth-message">{message}</p> : null}

        <button type="submit" className="auth-submit auth-submit--register">
          <span>Creare cont</span>
          <small>Cont salvat pe server cu rol utilizator</small>
        </button>
      </form>
    </AuthPageLayout>
  );
}

export default RegisterPage;
