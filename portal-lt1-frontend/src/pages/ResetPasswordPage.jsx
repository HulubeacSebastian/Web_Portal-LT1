import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import AuthStatusMessage from '../components/AuthStatusMessage.jsx';
import AuthSubmitButton from '../components/AuthSubmitButton.jsx';
import PasswordField from '../components/PasswordField.jsx';
import { apiRequest } from '../utils/apiClient';
import { validateRegister } from '../utils/formValidation';
import { hasErrors } from '../utils/documentValidation';

const highlightsFromLink = [
  'Link valid 60 de minute din email',
  'Alege o parola noua (minim 6 caractere)',
  'Dupa reset te autentifici din nou (parola + OTP)',
];

const highlightsManual = [
  'Introdu tokenul primit la recuperare',
  'Alege o parola noua (minim 6 caractere)',
  'Dupa reset te autentifici din nou (parola + OTP)',
];

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const fromState = location.state || {};
  const fromQuery = {
    resetToken: searchParams.get('resetToken') || '',
    token: searchParams.get('token') || ''
  };
  const initialResetToken = fromState.resetToken || fromQuery.resetToken;
  const initialToken = fromState.token || fromQuery.token;
  const hasResetLink =
    Boolean(fromQuery.resetToken && fromQuery.token) ||
    Boolean(fromState.resetToken && fromState.token);

  const [formData, setFormData] = useState({
    resetToken: initialResetToken,
    token: initialToken,
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [messageStatus, setMessageStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateRegister({
      name: 'Reset',
      email: 'reset@lt1.ro',
      password: formData.password,
      confirmPassword: formData.confirmPassword
    });
    const filtered = {
      password: nextErrors.password,
      confirmPassword: nextErrors.confirmPassword
    };
    if (!formData.resetToken.trim() || !formData.token.trim()) {
      filtered.resetToken = hasResetLink
        ? 'Linkul de resetare este invalid sau a expirat.'
        : 'Tokenul de resetare este obligatoriu.';
    }
    setErrors(filtered);
    if (hasErrors(filtered)) return;

    setLoading(true);
    try {
      const response = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: {
          resetToken: formData.resetToken.trim(),
          token: formData.token.trim(),
          password: formData.password
        }
      });
      setMessage(response.message);
      setMessageStatus('success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage(error?.message || 'Resetarea a esuat.');
      setMessageStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageLayout
      variant="reset"
      eyebrow="Parola noua"
      title="Reseteaza parola"
      lead={
        hasResetLink
          ? 'Alege parola noua pentru contul tau.'
          : 'Introdu tokenul primit si parola noua.'
      }
      highlights={hasResetLink ? highlightsFromLink : highlightsManual}
      formTitle="Parola noua"
      formLead={
        hasResetLink
          ? 'Parola noua (minim 6 caractere).'
          : 'Token + parola (minim 6 caractere).'
      }
      footer={
        <p className="auth-note">
          <Link to="/login">Inapoi la login</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {!hasResetLink ? (
          <>
            <div className={`auth-field${errors.resetToken ? ' has-error' : ''}`}>
              <label htmlFor="reset-id">ID resetare</label>
              <input
                id="reset-id"
                value={formData.resetToken}
                onChange={(event) => setFormData((p) => ({ ...p, resetToken: event.target.value }))}
                disabled={loading}
              />
              {errors.resetToken ? <p className="error">{errors.resetToken}</p> : null}
            </div>
            <div className="auth-field">
              <label htmlFor="reset-token">Token</label>
              <input
                id="reset-token"
                value={formData.token}
                onChange={(event) => setFormData((p) => ({ ...p, token: event.target.value }))}
                disabled={loading}
              />
            </div>
          </>
        ) : null}

        {hasResetLink && errors.resetToken ? (
          <p className="auth-status is-error" role="alert">
            {errors.resetToken}{' '}
            <Link to="/forgot-password">Cere un link nou</Link>
          </p>
        ) : null}

        <PasswordField
          id="reset-password"
          label="Parola noua"
          value={formData.password}
          onChange={(event) => setFormData((p) => ({ ...p, password: event.target.value }))}
          error={errors.password}
          placeholder="Minimum 6 caractere"
          autoComplete="new-password"
          disabled={loading}
        />

        <PasswordField
          id="reset-confirm"
          label="Confirma parola"
          value={formData.confirmPassword}
          onChange={(event) => setFormData((p) => ({ ...p, confirmPassword: event.target.value }))}
          error={errors.confirmPassword}
          placeholder="Repeta parola"
          autoComplete="new-password"
          disabled={loading}
        />

        <AuthSubmitButton loading={loading} loadingLabel="Se salveaza...">
          Salveaza parola
        </AuthSubmitButton>
      </form>

      <AuthStatusMessage message={message} status={messageStatus} />
    </AuthPageLayout>
  );
}

export default ResetPasswordPage;
