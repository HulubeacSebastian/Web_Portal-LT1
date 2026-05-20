import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import { apiRequest, AUTH_TOKEN_KEY } from '../utils/apiClient';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateLogin } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const highlights = [
  'Acces la documente si informatii scolare',
  'Vizualizare calendar si evenimente',
  'Preferinte salvate pentru o experienta personalizata',
];

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

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
    const nextErrors = validateLogin(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setMessage('');
      recordActivityEvent('login_failed_validation');
      return;
    }

    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: {
          email: formData.email.trim(),
          password: formData.password
        }
      });

      localStorage.setItem(AUTH_TOKEN_KEY, response.token);
      setCookie('portal_user', formData.email.trim(), { maxAge: 60 * 60 * 24 * 7 });
      savePreference('lastLoginEmail', formData.email.trim());
      recordActivityEvent('login_success');
      setMessage('Autentificare reusita.');
      navigate('/');
    } catch (error) {
      recordActivityEvent('login_failed_validation');
      setMessage(error?.message || 'Autentificare esuata. Verifica emailul si parola.');
    }
  };

  return (
    <AuthPageLayout
      variant="login"
      eyebrow="Acces securizat"
      title="Autentificare in portal"
      lead="Conecteaza-te pentru a accesa resursele liceului si a salva preferintele tale."
      highlights={highlights}
      formTitle="Date de autentificare"
      formLead="Introdu emailul si parola asociate contului tau."
      footer={
        <p className="auth-note">
          Nu ai cont? <Link to="/register">Creeaza unul</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className={`auth-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="login-email">Email/Username</label>
          <input
            id="login-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            placeholder="ex: elev@lt1.ro"
            maxLength={120}
            aria-invalid={Boolean(errors.email)}
            autoComplete="username"
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>

        <div className={`auth-field${errors.password ? ' has-error' : ''}`}>
          <label htmlFor="login-password">Parola</label>
          <input
            id="login-password"
            type="password"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            placeholder="Introdu parola"
            maxLength={80}
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
          />
          {errors.password ? <p className="error">{errors.password}</p> : null}
        </div>

        <button type="submit" className="auth-submit">
          <span>Autentificare</span>
          <small>Conectare la server — 7 zile</small>
        </button>

        {message ? (
          <p className="auth-status is-success" role="status">
            {message}
          </p>
        ) : null}
      </form>
    </AuthPageLayout>
  );
}

export default LoginPage;
