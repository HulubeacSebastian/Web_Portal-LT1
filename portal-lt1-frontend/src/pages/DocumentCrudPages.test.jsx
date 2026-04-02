import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DocumentDetailPage from './DocumentDetailPage';
import DocumentFormPage from './DocumentFormPage';
import DocumentListPage from './DocumentListPage';
import { DocumentsProvider } from '../store/DocumentsContext';

function renderCrudApp(initialPath) {
  return render(
    <DocumentsProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/documente" element={<DocumentListPage />} />
          <Route path="/documente/adauga" element={<DocumentFormPage mode="create" />} />
          <Route path="/documente/:id" element={<DocumentDetailPage />} />
          <Route path="/documente/:id/edit" element={<DocumentFormPage mode="edit" />} />
        </Routes>
      </MemoryRouter>
    </DocumentsProvider>
  );
}

describe('CRUD pages', () => {
  it('reselects first document when saved cookie id is missing', async () => {
    document.cookie = 'portal_last_document=DOC-UNKNOWN; path=/';
    renderCrudApp('/documente');

    const firstDocRow = screen.getByRole('button', { name: 'Regulament intern elevi 2026' }).closest('tr');
    expect(firstDocRow).toBeTruthy();
    await waitFor(() => expect(firstDocRow).toHaveClass('is-selected'));
  });

  it('uses saved cookie id when it exists', () => {
    document.cookie = 'portal_last_document=DOC-001; path=/';
    renderCrudApp('/documente');

    const firstDocRow = screen.getByRole('button', { name: 'Regulament intern elevi 2026' }).closest('tr');
    expect(firstDocRow).toHaveClass('is-selected');
  });

  it('reads documents list and supports search filters', async () => {
    const user = userEvent.setup();
    renderCrudApp('/documente');

    expect(screen.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Regulament intern elevi 2026' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Cautare'), 'document inexistent');
    expect(screen.getByText('Nu exista rezultate pentru filtrele curente.')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Cautare'));
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Arhivat' } });
    expect(screen.getByRole('button', { name: /Regulament biblioteca scolara/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Toate' } });
    await user.click(screen.getByRole('button', { name: 'Procedura inscriere clasa a IX-a' }));
    await user.click(screen.getByRole('button', { name: 'Inainte' }));
    await user.click(screen.getByRole('button', { name: 'Inapoi' }));
  });

  it('creates a document and opens its detail page', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(123456789);
    const user = userEvent.setup();
    renderCrudApp('/documente/adauga');

    await user.type(screen.getByLabelText('Titlu'), 'Proces verbal consiliu profesoral');
    await user.type(screen.getByLabelText('Categorie'), 'Administrativ');
    await user.type(screen.getByLabelText('Emitent'), 'Secretariat');
    await user.type(screen.getByLabelText('Data emiterii'), '2026-04-02');
    await user.selectOptions(screen.getByLabelText('Status'), 'Activ');
    await user.type(screen.getByLabelText('Descriere'), 'Proces verbal pentru sedinta de validare a planificarii semestriale.');

    await user.click(screen.getByRole('button', { name: 'Creeaza document' }));

    expect(screen.getByRole('heading', { name: 'Proces verbal consiliu profesoral' })).toBeInTheDocument();
    expect(screen.getByText(/DOC-456789/)).toBeInTheDocument();
  });

  it('updates an existing document from edit page', async () => {
    const user = userEvent.setup();
    renderCrudApp('/documente/DOC-001/edit');

    const titleInput = screen.getByLabelText('Titlu');
    await user.clear(titleInput);
    await user.type(titleInput, 'Regulament intern elevi 2026 - actualizat');
    await user.click(screen.getByRole('button', { name: 'Salveaza modificarile' }));

    expect(screen.getByRole('heading', { name: 'Regulament intern elevi 2026 - actualizat' })).toBeInTheDocument();
  });

  it('deletes an existing document and returns to list', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderCrudApp('/documente/DOC-001');

    await user.click(screen.getByRole('button', { name: 'Sterge' }));

    expect(screen.getByRole('heading', { name: 'DOCUMENTE SCOLARE' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Regulament intern elevi 2026' })).not.toBeInTheDocument();
  });

  it('keeps document when delete confirmation is cancelled', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderCrudApp('/documente/DOC-001');

    await user.click(screen.getByRole('button', { name: 'Sterge' }));

    expect(screen.getByRole('heading', { name: 'Regulament intern elevi 2026' })).toBeInTheDocument();
  });

  it('shows fallback page for missing document detail route', () => {
    renderCrudApp('/documente/DOES-NOT-EXIST');
    expect(screen.getByRole('heading', { name: 'Document inexistent' })).toBeInTheDocument();
  });

  it('shows fallback page for missing document edit route', () => {
    renderCrudApp('/documente/DOES-NOT-EXIST/edit');
    expect(screen.getByRole('heading', { name: 'Document inexistent' })).toBeInTheDocument();
  });

  it('supports cards mode branch and empty state in cards', async () => {
    const user = userEvent.setup();
    document.cookie = 'portal_view_mode=cards; path=/';
    renderCrudApp('/documente');

    expect(screen.getByRole('button', { name: /Regulament intern elevi 2026/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'TABEL' }));
    expect(screen.getByRole('columnheader', { name: 'Titlu document' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'CARDURI' }));

    await user.type(screen.getByLabelText('Cautare'), 'zzzz-inexistent');
    expect(screen.getByText('Nu exista rezultate pentru filtrele curente.')).toBeInTheDocument();
  });

  it('blocks invalid create submit, then allows valid submit', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(987654321);
    const user = userEvent.setup();
    renderCrudApp('/documente/adauga');

    await user.click(screen.getByRole('button', { name: 'Creeaza document' }));
    expect(screen.getByText('Titlul este obligatoriu.')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Status'), { target: { value: '' } });
    await user.click(screen.getByRole('button', { name: 'Creeaza document' }));
    expect(screen.getByText('Statusul este obligatoriu.')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Titlu'), 'Document validat complet');
    expect(screen.queryByText('Titlul este obligatoriu.')).not.toBeInTheDocument();

    await user.type(screen.getByLabelText('Categorie'), 'Administrativ');
    await user.type(screen.getByLabelText('Emitent'), 'Secretariat');
    await user.type(screen.getByLabelText('Data emiterii'), '2026-04-03');
    await user.selectOptions(screen.getByLabelText('Status'), 'Revizie');
    await user.type(screen.getByLabelText('Descriere'), 'Descriere valida pentru verificarea completa a formularului de documente.');
    await user.click(screen.getByRole('button', { name: 'Creeaza document' }));

    expect(screen.getByRole('heading', { name: 'Document validat complet' })).toBeInTheDocument();
    expect(screen.getByText(/DOC-654321/)).toBeInTheDocument();
  });
});

