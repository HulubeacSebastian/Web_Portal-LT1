import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout.jsx';
import { apiRequest } from '../utils/apiClient';
import { validateRegister } from '../utils/formValidation';
import { hasErrors } from '../utils/documentValidation';

const highlights = [
  'Introdu tokenul primit la recuperare',
  'Alege o parola noua (minim 6 caractere)',
  'Dupa reset te autentifici din nou (parola + OTP)',
];

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initial = location.state || {};

  const [formData, setFormData] = useState({
    resetToken: initial.resetToken || '',
    token: initial.token || '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

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
      filtered.resetToken = 'Tokenul de resetare este obligatoriu.';
    }
    setErrors(filtered);
    if (hasErrors(filtered)) return;

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
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setMessage(error?.message || 'Resetarea a esuat.');
    }
  };

  return (
    <AuthPageLayout
      variant="login"
      eyebrow="Parola noua"
      title="Reseteaza parola"
      lead="Introdu tokenul primit si parola noua."
      highlights={highlights}
      formTitle="Parola noua"
      formLead="Token + parola (minim 6 caractere)."
      footer={
        <p className="auth-note">
          <Link to="/login">Inapoi la login</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="auth-field">
          <label htmlFor="reset-id">ID resetare</label>
          <input
            id="reset-id"
            value={formData.resetToken}
            onChange={(event) => setFormData((p) => ({ ...p, resetToken: event.target.value }))}
          />
        </div>
        <div className="auth-field">
          <label htmlFor="reset-token">Token</label>
          <input
            id="reset-token"
            value={formData.token}
            onChange={(event) => setFormData((p) => ({ ...p, token: event.target.value }))}
          />
        </div>
        <div className={`auth-field${errors.password ? ' has-error' : ''}`}>
          <label htmlFor="reset-password">Parola noua</label>
          <input
            id="reset-password"
            type="password"
            value={formData.password}
            onChange={(event) => setFormData((p) => ({ ...p, password: event.target.value }))}
          />
          {errors.password ? <p className="error">{errors.password}</p> : null}
        </div>
        <div className={`auth-field${errors.confirmPassword ? ' has-error' : ''}`}>
          <label htmlFor="reset-confirm">Confirma parola</label>
          <input
            id="reset-confirm"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => setFormData((p) => ({ ...p, confirmPassword: event.target.value }))}
          />
          {errors.confirmPassword ? <p className="error">{errors.confirmPassword}</p> : null}
        </div>

        <button type="submit" className="auth-submit">
          <span>Salveaza parola</span>
        </button>
      </form>

      {message ? <p className="auth-status is-success" role="status">{message}</p> : null}
    </AuthPageLayout>
  );
}

export default ResetPasswordPage;
