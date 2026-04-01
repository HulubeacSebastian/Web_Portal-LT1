import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setCookie('portal_user', formData.email || 'guest', { maxAge: 60 * 60 * 24 * 7 });
    setMessage('Autentificare simulata cu succes.');
    navigate('/');
  };

  return (
    <section className="card auth-page">
      <p className="eyebrow">Autentificare</p>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="login-password">Parola</label>
          <input
            id="login-password"
            type="password"
            value={formData.password}
            onChange={(event) => setFormData((prev) => ({ ...prev, password: event.target.value }))}
          />
        </div>
        <button type="submit">Intra in cont</button>
      </form>
      {message ? <p className="muted">{message}</p> : null}
      <p className="muted">
        Nu ai cont? <Link to="/register">Creeaza unul</Link>
      </p>
    </section>
  );
}

export default LoginPage;

