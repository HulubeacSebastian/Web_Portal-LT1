import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import AuthStatusMessage from '../components/AuthStatusMessage.jsx';
import AuthSubmitButton from '../components/AuthSubmitButton.jsx';
import { apiRequest } from '../utils/apiClient';
import { hasErrors } from '../utils/documentValidation';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const highlights = [
  'Token de resetare cu expirare (1 ora)',
  'Parola noua salvata criptat (bcrypt)',
  'Sesiunile vechi sunt invalidate automat',
];

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [resetPayload, setResetPayload] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailErrors = {};
    if (!email.trim()) {
      emailErrors.email = 'Email-ul este obligatoriu.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      emailErrors.email = 'Email-ul nu are un format valid.';
    }
    setErrors(emailErrors);
    if (hasErrors(emailErrors)) return;

    setLoading(true);
    setStatus(null);
    setMessage('');
    try {
      const response = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim() }
      });
      setStatus('success');
      setMessage('Email de resetare a fost trimis. Verifica si folderul Spam.');
      if (response.resetToken && response.devResetCode) {
        setResetPayload({
          resetToken: response.resetToken,
          token: response.devResetCode
        });
      }
    } catch (error) {
      setStatus('error');
      setMessage(error?.message || 'Cererea a esuat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      variant="forgot"
      eyebrow="Recuperare parola"
      title="Ai uitat parola?"
      lead="Primesti un link securizat pe email."
      highlights={highlights}
      formTitle="Resetare parola"
      formLead="Introdu emailul contului."
      footer={
        <p className="auth-note">
          <Link to="/login">Inapoi la login</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className={`auth-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="ex: profesor@lt1.ro"
            disabled={loading}
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>

        <AuthSubmitButton loading={loading} loadingLabel="Se trimite...">
          Trimite link de resetare
        </AuthSubmitButton>
      </form>

      <AuthStatusMessage message={message} status={status} />

      {resetPayload ? (
        <AuthSubmitButton
          type="button"
          onClick={() =>
            navigate('/reset-password', {
              state: resetPayload
            })
          }
        >
          Continua resetarea
        </AuthSubmitButton>
      ) : null}
    </AuthPageLayout>
  );
}

export default ForgotPasswordPage;
