import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import { apiRequest, AUTH_CHANGED_EVENT } from '../utils/apiClient';
import { saveAuthSession } from '../utils/authSession';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateLogin } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const highlights = [
  'Autentificare in 3 pasi: parola, cod OTP, sesiune securizata',
  'Acces la documente si informatii scolare',
  'Token-uri cu permisiuni pe rol (admin / user)',
];

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [challengeId, setChallengeId] = useState('');
  const [devCode, setDevCode] = useState('');
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

  const finishLogin = (response) => {
    saveAuthSession({
      token: response.token,
      refreshToken: response.refreshToken,
      user: response.user
    });
    setCookie('portal_user', response.user.email, { maxAge: 60 * 60 * 24 * 7 });
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    savePreference('lastLoginEmail', formData.email.trim());
    recordActivityEvent('login_success');
    setMessage('Autentificare reusita.');
    navigate('/');
  };

  const handleCredentialsSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
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

      setChallengeId(response.challengeId);
      if (response.devCode) {
        setDevCode(response.devCode);
      }
      setStep(2);
      setMessage(response.message || 'Introdu codul de verificare.');
    } catch (error) {
      recordActivityEvent('login_failed_validation');
      setMessage(error?.message || 'Autentificare esuata. Verifica emailul si parola.');
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Codul este obligatoriu.' });
      return;
    }

    try {
      const response = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: {
          challengeId,
          code: formData.otp.trim()
        }
      });
      finishLogin(response);
    } catch (error) {
      setMessage(error?.message || 'Cod invalid.');
    }
  };

  return (
    <AuthPageLayout
      variant="login"
      eyebrow="Acces securizat — Assignment 4"
      title="Autentificare in portal"
      lead="Conecteaza-te in 3 pasi: parola, verificare OTP, sesiune cu token."
      highlights={highlights}
      formTitle={step === 1 ? 'Pasul 1 — Parola' : 'Pasul 2 — Cod OTP'}
      formLead={
        step === 1
          ? 'Introdu emailul si parola.'
          : 'Introdu codul de 6 cifre (in dev apare si mai jos).'
      }
      footer={
        <p className="auth-note">
          Nu ai cont? <Link to="/register">Creeaza unul</Link>
          {' · '}
          <Link to="/forgot-password">Ai uitat parola?</Link>
        </p>
      }
    >
      {step === 1 ? (
        <form onSubmit={handleCredentialsSubmit} className="auth-form" noValidate>
          <div className={`auth-field${errors.email ? ' has-error' : ''}`}>
            <label htmlFor="login-email">Email/Username</label>
            <input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="ex: profesor@lt1.ro"
              maxLength={120}
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
              autoComplete="current-password"
            />
            {errors.password ? <p className="error">{errors.password}</p> : null}
          </div>

          <button type="submit" className="auth-submit">
            <span>Continua</span>
            <small>Pasul 1 din 3</small>
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="auth-form" noValidate>
          {devCode ? (
            <p className="auth-hint" role="note">
              Cod dev (laborator): <strong>{devCode}</strong>
            </p>
          ) : null}

          <div className={`auth-field${errors.otp ? ' has-error' : ''}`}>
            <label htmlFor="login-otp">Cod verificare</label>
            <input
              id="login-otp"
              type="text"
              inputMode="numeric"
              value={formData.otp}
              onChange={(event) => handleChange('otp', event.target.value)}
              placeholder="6 cifre"
              maxLength={6}
              autoComplete="one-time-code"
            />
            {errors.otp ? <p className="error">{errors.otp}</p> : null}
          </div>

          <button type="submit" className="auth-submit">
            <span>Finalizeaza autentificarea</span>
            <small>Pasul 2–3 — sesiune JWT + refresh</small>
          </button>

          <button
            type="button"
            className="auth-link-button"
            onClick={() => {
              setStep(1);
              setMessage('');
            }}
          >
            Inapoi la parola
          </button>
        </form>
      )}

      {message ? (
        <p className={`auth-status${message.includes('reusita') ? ' is-success' : ''}`} role="status">
          {message}
        </p>
      ) : null}
    </AuthPageLayout>
  );
}

export default LoginPage;
