import { describe, expect, it } from 'vitest';
import { hasErrors, validateDocument } from './documentValidation';

describe('documentValidation', () => {
  it('returns no errors for a valid document payload', () => {
    const errors = validateDocument({
      title: 'Document valid',
      category: 'HR',
      issuer: 'Secretariat',
      issuedAt: '2026-04-01',
      status: 'Activ',
      description: 'Descriere suficient de lunga.'
    });

    expect(errors).toEqual({});
    expect(hasErrors(errors)).toBe(false);
  });

  it('flags missing required fields and short descriptions', () => {
    const errors = validateDocument({
      title: '',
      category: '',
      issuer: '',
      issuedAt: '',
      status: '',
      description: 'scurt'
    });

    expect(errors.title).toBe('Titlul este obligatoriu.');
    expect(errors.category).toBe('Categoria este obligatorie.');
    expect(errors.issuer).toBe('Emitentul este obligatoriu.');
    expect(errors.issuedAt).toBe('Data emiterii este obligatorie.');
    expect(errors.status).toBe('Statusul este obligatoriu.');
    expect(errors.description).toBe('Descrierea trebuie sa aiba minimum 10 caractere.');
    expect(hasErrors(errors)).toBe(true);
  });

  it('flags invalid lengths, status and date format', () => {
    const errors = validateDocument({
      title: 'A',
      category: 'X',
      issuer: 'Y',
      issuedAt: 'data-invalida',
      status: 'Draft',
      description: 'Descriere ok, dar restul campurilor nu respecta regulile.'
    });

    expect(errors.title).toBe('Titlul trebuie sa aiba minimum 3 caractere.');
    expect(errors.category).toBe('Categoria trebuie sa aiba minimum 2 caractere.');
    expect(errors.issuer).toBe('Emitentul trebuie sa aiba minimum 2 caractere.');
    expect(errors.issuedAt).toBe('Data emiterii nu este valida.');
    expect(errors.status).toBe('Statusul selectat nu este valid.');
    expect(hasErrors(errors)).toBe(true);
  });
});

