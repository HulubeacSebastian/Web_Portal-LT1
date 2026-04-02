import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../store/DocumentsContext', () => ({
  useDocuments: () => ({ documents: [] })
}));

vi.mock('../utils/cookies', () => ({
  getCookie: () => '',
  setCookie: vi.fn()
}));

import DocumentListPage from './DocumentListPage';

describe('DocumentListPage empty state', () => {
  it('shows empty master-detail state when there are no documents', () => {
    render(
      <MemoryRouter>
        <DocumentListPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Nu exista document selectat' })).toBeInTheDocument();
    expect(screen.getByText('Nu exista rezultate pentru filtrele curente.')).toBeInTheDocument();
  });
});

