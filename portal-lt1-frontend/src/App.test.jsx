import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App routes', () => {
  it('renders home page content on root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('Acasa')).toBeInTheDocument();
    expect(screen.getByText('START ADMITERE 2026: INVATA O MESERIE DE VIITOR!')).toBeInTheDocument();
  });

  it.each([
    ['/despre-noi', 'CINE SUNTEM?'],
    ['/contact', 'Nume și Prenume'],
    ['/calendar', 'Generare Orar'],
    ['/documente2', 'Evolutia documentelor incarcate (2026)'],
  ])('renders the %s route', (path, expectedText) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
