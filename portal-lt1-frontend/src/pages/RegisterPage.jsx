import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import AuthStatusMessage from '../components/AuthStatusMessage.jsx';
import AuthSubmitButton from '../components/AuthSubmitButton.jsx';
import PasswordField from '../components/PasswordField.jsx';
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
  const [messageStatus, setMessageStatus] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      recordActivityEvent('register_failed_validation');
      setMessage('');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password
        }
      });

      saveAuthSession({
        token: response.token,
        refreshToken: response.refreshToken,
        user: response.user
      });
      setCookie('portal_user', response.user.email, { maxAge: 60 * 60 * 24 * 7 });
      window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
      savePreference('lastRegisteredName', formData.name.trim());
      recordActivityEvent('register_success');
      setMessage('Cont creat cu succes.');
      setMessageStatus('success');
      navigate('/');
    } catch (error) {
      recordActivityEvent('register_failed_validation');
      const serverErrors = error?.data?.errors;
      if (serverErrors && typeof serverErrors === 'object') {
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
      setMessage(error?.message || 'Inregistrarea a esuat. Incearca din nou.');
      setMessageStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      variant="register"
      eyebrow="Cont nou"
      title="Creare cont portal"
      lead="Acces personalizat la platforma educationala LT1."
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
            disabled={loading}
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
            disabled={loading}
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
          disabled={loading}
        />

        <PasswordField
          id="register-confirm-password"
          label="Confirmare Parola"
          value={formData.confirmPassword}
          onChange={(event) => handleChange('confirmPassword', event.target.value)}
          error={errors.confirmPassword}
          placeholder="Repeta parola"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthSubmitButton
          loading={loading}
          loadingLabel="Se creeaza contul..."
          variant="register"
          subtitle="Cont salvat pe server cu rol utilizator"
        >
          Creare cont
        </AuthSubmitButton>
      </form>

      <AuthStatusMessage message={message} status={messageStatus} />
    </AuthPageLayout>
  );
}

export default RegisterPage;
