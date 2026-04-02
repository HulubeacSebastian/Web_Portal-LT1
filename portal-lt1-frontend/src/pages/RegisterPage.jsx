import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    setCookie('portal_user', formData.name || 'guest', { maxAge: 60 * 60 * 24 * 7 });
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
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="register-email">Email/Username</label>
          <input
            id="register-email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="register-password">Parola</label>
          <input
            id="register-password"
            type="password"
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="register-confirm-password">Confirmare Parola</label>
          <input
            id="register-confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => setFormData((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          />
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

