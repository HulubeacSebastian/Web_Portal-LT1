import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateLogin } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

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
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      setMessage('');
      recordActivityEvent('login_failed_validation');
      return;
    }

    setCookie('portal_user', formData.email.trim(), { maxAge: 60 * 60 * 24 * 7 });
    savePreference('lastLoginEmail', formData.email.trim());
    recordActivityEvent('login_success');
    setMessage('Autentificare simulata cu succes.');
    navigate('/');
  };

  return (
    <section className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div>
          <label htmlFor="login-email">Email/Username</label>
          <input
            id="login-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            maxLength={120}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="login-password">Parola</label>
          <input
            id="login-password"
            type="password"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            maxLength={80}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? <p className="error">{errors.password}</p> : null}
        </div>
        <button type="submit" className="auth-submit">Autentificare</button>
      </form>
      {message ? <p className="auth-note">{message}</p> : null}
      <p className="auth-note">
        Nu ai cont? <Link to="/register">Creeaza unul</Link>
      </p>
    </section>
  );
}

export default LoginPage;

