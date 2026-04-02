import { describe, expect, it } from 'vitest';
import { validateContact, validateLogin, validateRegister } from './formValidation';

describe('formValidation', () => {
  it('validates login fields', () => {
    expect(
      validateLogin({
        email: 'elev@test.ro',
        password: 'parola123'
      })
    ).toEqual({});

    const errors = validateLogin({
      email: 'invalid',
      password: '123'
    });

    expect(errors.email).toBe('Email-ul nu are un format valid.');
    expect(errors.password).toBe('Parola trebuie sa aiba minimum 6 caractere.');
  });

  it('validates register fields', () => {
    expect(
      validateRegister({
        name: 'Elev Test',
        email: 'elev@test.ro',
        password: 'parola123',
        confirmPassword: 'parola123'
      })
    ).toEqual({});

    const errors = validateRegister({
      name: 'Al',
      email: 'email',
      password: '1234',
      confirmPassword: '5678'
    });

    expect(errors.name).toBe('Numele trebuie sa aiba minimum 3 caractere.');
    expect(errors.email).toBe('Email-ul nu are un format valid.');
    expect(errors.password).toBe('Parola trebuie sa aiba minimum 8 caractere.');
    expect(errors.confirmPassword).toBe('Parolele nu coincid.');
  });

  it('validates contact fields', () => {
    expect(
      validateContact({
        name: 'Profesor Test',
        email: 'prof@test.ro',
        message: 'Mesaj complet pentru echipa scolii.'
      })
    ).toEqual({});

    const errors = validateContact({
      name: '',
      email: 'bad',
      message: 'scurt'
    });

    expect(errors.name).toBe('Numele este obligatoriu.');
    expect(errors.email).toBe('Email-ul nu are un format valid.');
    expect(errors.message).toBe('Mesajul trebuie sa aiba minimum 10 caractere.');
  });
});

