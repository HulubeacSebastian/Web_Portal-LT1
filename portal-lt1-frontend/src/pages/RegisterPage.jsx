import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    setCookie('portal_user', formData.name || 'guest', { maxAge: 60 * 60 * 24 * 7 });
    navigate('/');
  };

  return (
    <section className="card auth-page">
      <p className="eyebrow">Inregistrare</p>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="register-name">Nume</label>
          <input
            id="register-name"
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="register-email">Email</label>
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
        <button type="submit">Creeaza cont</button>
      </form>
      <p className="muted">
        Ai deja cont? <Link to="/login">Autentifica-te</Link>
      </p>
    </section>
  );
}

export default RegisterPage;

