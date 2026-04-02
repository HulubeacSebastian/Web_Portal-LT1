import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentsProvider, useDocuments } from './DocumentsContext';

function DocumentsTestHarness() {
  const { documents, addDocument, updateDocument, deleteDocument, getDocumentById } = useDocuments();
  const [lookupId, setLookupId] = useState('DOC-001');

  return (
    <div>
      <span data-testid="count">{documents.length}</span>
      <span data-testid="first">{documents[0]?.title}</span>
      <span data-testid="lookup">{getDocumentById(lookupId)?.title ?? 'none'}</span>
      <button
        type="button"
        onClick={() =>
          addDocument({
            title: 'Document nou',
            category: 'Test',
            issuer: 'QA',
            issuedAt: '2026-04-01',
            status: 'Activ',
            description: 'Descriere document nou.'
          })
        }
      >
        add
      </button>
      <button type="button" onClick={() => updateDocument('DOC-001', { title: 'Actualizat' })}>
        update
      </button>
      <button type="button" onClick={() => deleteDocument('DOC-001')}>
        delete
      </button>
      <button type="button" onClick={() => setLookupId('DOC-002')}>
        lookup
      </button>
    </div>
  );
}

describe('DocumentsContext', () => {
  it('supports add, update, delete and lookup operations', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(123456789);
    const user = userEvent.setup();

    render(
      <DocumentsProvider>
        <DocumentsTestHarness />
      </DocumentsProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('12');
    expect(screen.getByTestId('first')).toHaveTextContent('Regulament intern elevi 2026');
    expect(screen.getByTestId('lookup')).toHaveTextContent('Regulament intern elevi 2026');

    await user.click(screen.getByRole('button', { name: 'add' }));
    expect(screen.getByTestId('count')).toHaveTextContent('13');
    expect(screen.getByTestId('first')).toHaveTextContent('Document nou');

    await user.click(screen.getByRole('button', { name: 'update' }));
    expect(screen.getByTestId('lookup')).toHaveTextContent('Actualizat');

    await user.click(screen.getByRole('button', { name: 'delete' }));
    expect(screen.getByTestId('count')).toHaveTextContent('12');
    expect(screen.getByTestId('lookup')).toHaveTextContent('none');

    await user.click(screen.getByRole('button', { name: 'lookup' }));
    expect(screen.getByTestId('lookup')).toHaveTextContent('Procedura inscriere clasa a IX-a');
  });

  it('throws when hook is used outside DocumentsProvider', () => {
    function InvalidHarness() {
      useDocuments();
      return null;
    }

    expect(() => render(<InvalidHarness />)).toThrow('useDocuments must be used inside DocumentsProvider');
  });
});

