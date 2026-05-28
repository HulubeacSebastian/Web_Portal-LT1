import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

describe('App routes', () => {
  it('renders home page content on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /ac(a|ă)s(a|ă)/i })).toBeInTheDocument();
    expect(screen.getByText('START ADMITERE 2026: INVATA O MESERIE DE VIITOR!')).toBeInTheDocument();
  });

  it.each([
    ['/despre-noi', 'Cine suntem'],
    ['/contact', 'Nume și Prenume'],
    ['/calendar', 'Generare Orar'],
    ['/documente2', 'Analiza documentelor'],
  ])('renders the %s route', (path, expectedText) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('renders activity page only for admin session', () => {
    localStorage.setItem('portal_jwt', 'test-token');
    localStorage.setItem(
      'portal_user_profile',
      JSON.stringify({ id: 'USR-001', role: 'admin', email: 'admin@lt1.ro' })
    );

    render(
      <MemoryRouter initialEntries={['/activitate']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Conturi utilizatori')).toBeInTheDocument();

    localStorage.clear();
  });
});
