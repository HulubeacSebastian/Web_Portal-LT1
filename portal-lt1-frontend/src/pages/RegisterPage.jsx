import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';
import { hasErrors } from '../utils/documentValidation';
import { validateRegister } from '../utils/formValidation';
import { recordActivityEvent, savePreference } from '../utils/activityCookies';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateRegister(formData);
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      recordActivityEvent('register_failed_validation');
      return;
    }

    setCookie('portal_user', formData.name.trim(), { maxAge: 60 * 60 * 24 * 7 });
    savePreference('lastRegisteredName', formData.name.trim());
    recordActivityEvent('register_success');
    navigate('/');
  };

  return (
    <section className="auth-page">
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div>
          <label htmlFor="register-name">Nume</label>
          <input
            id="register-name"
            value={formData.name}
            onChange={(event) => handleChange('name', event.target.value)}
            maxLength={80}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="error">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="register-email">Email/Username</label>
          <input
            id="register-email"
            type="email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            maxLength={120}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="error">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor="register-password">Parola</label>
          <input
            id="register-password"
            type="password"
            value={formData.password}
            onChange={(event) => handleChange('password', event.target.value)}
            maxLength={80}
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? <p className="error">{errors.password}</p> : null}
        </div>
        <div>
          <label htmlFor="register-confirm-password">Confirmare Parola</label>
          <input
            id="register-confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => handleChange('confirmPassword', event.target.value)}
            maxLength={80}
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword ? <p className="error">{errors.confirmPassword}</p> : null}
        </div>
        <button type="submit" className="auth-submit">Creare cont</button>
      </form>
      <p className="auth-note">
        Ai deja cont? <Link to="/login">Autentifica-te</Link>
      </p>
    </section>
  );
}

export default RegisterPage;

