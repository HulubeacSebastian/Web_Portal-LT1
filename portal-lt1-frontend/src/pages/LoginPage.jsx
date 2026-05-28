import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import AuthStepper from '../components/AuthStepper.jsx';
import AuthStatusMessage from '../components/AuthStatusMessage.jsx';
import AuthSubmitButton from '../components/AuthSubmitButton.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { apiRequest, AUTH_CHANGED_EVENT } from '../utils/apiClient';
import { saveAuthSession } from '../utils/authSession';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateLogin } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const highlights = [
  'Autentificare in 3 pasi: parola, cod OTP pe email, sesiune securizata',
  'Acces la documente si informatii scolare',
  'Token-uri cu permisiuni pe rol (admin / user)',
];

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [challengeId, setChallengeId] = useState('');
  const [devCode, setDevCode] = useState('');
  const [verifyMode, setVerifyMode] = useState('login');
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingCredentials, setLoadingCredentials] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (message) {
      setMessage('');
      setMessageStatus(null);
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
    setMessageStatus('success');
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

    setLoadingCredentials(true);
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
      setVerifyMode('login');
      setStep(2);
      setMessage(response.message || 'Introdu codul de verificare.');
      setMessageStatus('success');
    } catch (error) {
      recordActivityEvent('login_failed_validation');
      if (error?.data?.needsEmailVerification) {
        setChallengeId(error.data.challengeId);
        if (error.data.devCode) {
          setDevCode(error.data.devCode);
        }
        setVerifyMode('email');
        setStep(2);
        setMessage(error.message || 'Contul nu este activat. Introdu codul trimis pe email.');
        setMessageStatus('success');
        return;
      }
      setMessage(error?.message || 'Parola sau email invalid.');
      setMessageStatus('error');
    } finally {
      setLoadingCredentials(false);
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    if (!formData.otp.trim()) {
      setErrors({ otp: 'Codul este obligatoriu.' });
      return;
    }

    setLoadingOtp(true);
    try {
      const verifyPath =
        verifyMode === 'email' ? '/api/auth/register/verify-email' : '/api/auth/verify-otp';
      const response = await apiRequest(verifyPath, {
        method: 'POST',
        body: {
          challengeId,
          code: formData.otp.trim()
        }
      });
      finishLogin(response);
    } catch (error) {
      setMessage(error?.message || 'Cod invalid.');
      setMessageStatus('error');
    } finally {
      setLoadingOtp(false);
    }
  };

  const stepperStep = loadingOtp ? 3 : step;

  return (
    <AuthPageLayout
      variant="login"
      eyebrow="Autentificare"
      title="Autentificare in portal"
      lead="Parola, verificare OTP si sesiune securizata."
      highlights={highlights}
      formTitle={step === 1 ? 'Pasul 1 — Parola' : verifyMode === 'email' ? 'Pasul 2 — Activare cont' : 'Pasul 2 — Cod OTP'}
      formLead={
        step === 1
          ? 'Introdu emailul si parola.'
          : verifyMode === 'email'
            ? 'Contul nu este activat. Introdu codul primit pe email (verifica si Spam).'
            : 'Introdu codul de 6 cifre primit pe email (verifica si Spam).'
      }
      footer={
        <p className="auth-note">
          Nu ai cont? <Link to="/register">Creeaza unul</Link>
          {' · '}
          <Link to="/forgot-password">Ai uitat parola?</Link>
        </p>
      }
    >
      <AuthStepper currentStep={stepperStep} />

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
              disabled={loadingCredentials}
            />
            {errors.email ? <p className="error">{errors.email}</p> : null}
          </div>

          <PasswordField
            id="login-password"
            label="Parola"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            error={errors.password}
            placeholder="Introdu parola"
            autoComplete="current-password"
            disabled={loadingCredentials}
          />

          <AuthSubmitButton loading={loadingCredentials} subtitle="Pasul 1 din 3">
            Continua
          </AuthSubmitButton>
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
              disabled={loadingOtp}
            />
            {errors.otp ? <p className="error">{errors.otp}</p> : null}
          </div>

          <AuthSubmitButton
            loading={loadingOtp}
            loadingLabel="Se autentifica..."
            subtitle="Pasul 2 din 3"
          >
            Finalizeaza autentificarea
          </AuthSubmitButton>

          <button
            type="button"
            className="auth-link-button"
            disabled={loadingOtp}
            onClick={() => {
              setStep(1);
              setVerifyMode('login');
              setMessage('');
              setMessageStatus(null);
            }}
          >
            Inapoi la parola
          </button>
        </form>
      )}

      <AuthStatusMessage message={message} status={messageStatus} />
    </AuthPageLayout>
  );
}

export default LoginPage;
