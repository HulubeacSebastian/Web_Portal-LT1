function AuthSubmitButton({
  loading = false,
  disabled = false,
  children,
  subtitle,
  variant = '',
  type = 'submit',
  loadingLabel = 'Se incarca...',
  onClick
}) {
  const className = [
    'auth-submit',
    variant ? `auth-submit--${variant}` : '',
    loading ? 'is-loading' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading}
    >
      {loading ? (
        <span className="auth-submit-loading-row">
          <span className="auth-submit-spinner" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </span>
      ) : (
        <>
          <span>{children}</span>
          {subtitle ? <small>{subtitle}</small> : null}
        </>
      )}
    </button>
  );
}

export default AuthSubmitButton;
