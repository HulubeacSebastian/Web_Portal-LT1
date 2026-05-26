import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
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
  const [errors, setErrors] = useState({});
  const [resetPayload, setResetPayload] = useState(null);

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

    try {
      const response = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: { email: email.trim() }
      });
      setMessage(response.message);
      if (response.resetToken && response.devResetCode) {
        setResetPayload({
          resetToken: response.resetToken,
          token: response.devResetCode
        });
      }
    } catch (error) {
      setMessage(error?.message || 'Cererea a esuat.');
    }
  };

  return (
    <AuthPageLayout
      variant="login"
      eyebrow="Recuperare parola"
      title="Ai uitat parola?"
      lead="Trimitem un token de resetare (in dev il vezi pe ecran)."
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
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>

        <button type="submit" className="auth-submit">
          <span>Trimite link de resetare</span>
        </button>
      </form>

      {message ? <p className="auth-status" role="status">{message}</p> : null}

      {resetPayload ? (
        <button
          type="button"
          className="auth-submit"
          onClick={() =>
            navigate('/reset-password', {
              state: resetPayload
            })
          }
        >
          <span>Continua resetarea</span>
          <small>Token dev disponibil</small>
        </button>
      ) : null}
    </AuthPageLayout>
  );
}

export default ForgotPasswordPage;
