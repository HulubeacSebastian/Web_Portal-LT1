import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section className="card centered-card">
      <p className="eyebrow">404</p>
      <h2>Pagina nu a fost gasita</h2>
      <p className="muted">Ruta accesata nu exista in aplicatie.</p>
      <Link to="/" className="btn">
        Inapoi la Acasa
      </Link>
    </section>
  );
}

export default NotFoundPage;
