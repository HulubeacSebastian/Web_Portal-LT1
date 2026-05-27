import { useState } from 'react';

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5c-5.5 0-9.5 5-10 7  .5 2 4.5 7 10 7s9.5-5 10-7c-.5-2-4.5-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.3 2.3 2 3.6l3.1 3.1C3.5 8.2 1.7 10 1 12c.5 2 4.5 7 11 7 2.1 0 4-.5 5.6-1.3l3.3 3.3 1.3-1.3L3.3 2.3zM12 17c-4.1 0-7.4-3.2-8.8-5 1-1.5 3.2-3.8 6.5-4.6l2.1 2.1a4 4 0 0 0 5.7 5.7l1.6 1.6C16.9 16.6 14.6 17 12 17zm7.8-2.2-1.5-1.5a4 4 0 0 0-5.6-5.6L11.2 6.2c3.3.8 5.5 3.1 6.5 4.6-.6.9-1.5 2.2-2.9 3.2z"
      />
    </svg>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  maxLength = 80,
  disabled = false
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={`auth-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <div className="auth-password-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          disabled={disabled}
        />
        <button
          type="button"
          className="auth-password-toggle"
          disabled={disabled}
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Ascunde parola' : 'Arata parola'}
          aria-pressed={visible}
        >
          <EyeIcon hidden={visible} />
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default PasswordField;
