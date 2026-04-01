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
});
