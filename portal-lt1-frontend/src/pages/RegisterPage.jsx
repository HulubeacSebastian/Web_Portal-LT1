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
import { validateRegister } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

const REGISTER_STEPS = [
  { id: 1, label: 'Date cont' },
  { id: 2, label: 'Cod email' },
  { id: 3, label: 'Sesiune' }
];

const highlights = [
  'Verificare email obligatorie inainte de activare',
  'Rol utilizator cu permisiuni restrictionate',
  'Cont activ doar dupa confirmarea codului primit pe email',
];

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
  const [challengeId, setChallengeId] = useState('');
  const [devCode, setDevCode] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState(null);
  const [loadingRegister, setLoadingRegister] = useState(false);
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

  const finishRegister = (response) => {
    saveAuthSession({
      token: response.token,
      refreshToken: response.refreshToken,
      user: response.user
    });
    setCookie('portal_user', response.user.email, { maxAge: 60 * 60 * 24 * 7 });
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    savePreference('lastRegisteredName', formData.name.trim());
    recordActivityEvent('register_success');
    setMessage('Cont activat cu succes.');
    setMessageStatus('success');
    navigate('/');
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      recordActivityEvent('register_failed_validation');
      return;
    }

    setLoadingRegister(true);
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
      });

      setChallengeId(response.challengeId);
      if (response.devCode) {
        setDevCode(response.devCode);
      }
      setStep(2);
      setMessage(response.message || 'Introdu codul de activare.');
      setMessageStatus('success');
    } catch (error) {
      recordActivityEvent('register_failed_validation');
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage(error?.message || 'Inregistrarea a esuat. Incearca din nou.');
      setMessageStatus('error');
    } finally {
      setLoadingRegister(false);
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
      const response = await apiRequest('/api/auth/register/verify-email', {
        method: 'POST',
        body: {
          challengeId,
          code: formData.otp.trim()
        }
      });
      finishRegister(response);
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
      variant="register"
      eyebrow="Cont nou"
      title="Creare cont portal"
      lead="Completeaza datele, confirma emailul si activeaza contul."
      highlights={highlights}
      formTitle={step === 1 ? 'Pasul 1 — Date cont' : 'Pasul 2 — Cod activare'}
      formLead={
        step === 1
          ? 'Completeaza datele de mai jos pentru a-ti crea contul.'
          : 'Introdu codul de 6 cifre primit pe email (verifica si Spam).'
      }
      footer={
        <p className="auth-note">
          Ai deja cont? <Link to="/login">Autentifica-te</Link>
        </p>
      }
    >
      <AuthStepper currentStep={stepperStep} steps={REGISTER_STEPS} />

      {step === 1 ? (
        <form onSubmit={handleRegisterSubmit} className="auth-form" noValidate>
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
              disabled={loadingRegister}
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
              disabled={loadingRegister}
            />
            {errors.email ? <p className="error">{errors.email}</p> : null}
          </div>

          <PasswordField
            id="register-password"
            label="Parola"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            error={errors.password}
            placeholder="Minimum 6 caractere"
            autoComplete="new-password"
            disabled={loadingRegister}
          />

          <PasswordField
            id="register-confirm-password"
            label="Confirmare Parola"
            value={formData.confirmPassword}
            onChange={(event) => handleChange('confirmPassword', event.target.value)}
            error={errors.confirmPassword}
            placeholder="Repeta parola"
            autoComplete="new-password"
            disabled={loadingRegister}
          />

          <AuthSubmitButton
            loading={loadingRegister}
            loadingLabel="Se trimite codul..."
            variant="register"
            subtitle="Pasul 1 din 3"
          >
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
            <label htmlFor="register-otp">Cod activare</label>
            <input
              id="register-otp"
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
            loadingLabel="Se activeaza contul..."
            variant="register"
            subtitle="Pasul 2 din 3"
          >
            Activeaza contul
          </AuthSubmitButton>

          <button
            type="button"
            className="auth-link-button"
            disabled={loadingOtp}
            onClick={() => {
              setStep(1);
              setMessage('');
              setMessageStatus(null);
            }}
          >
            Inapoi la date cont
          </button>
        </form>
      )}

      <AuthStatusMessage message={message} status={messageStatus} />
    </AuthPageLayout>
  );
}

export default RegisterPage;
