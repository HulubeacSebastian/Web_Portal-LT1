import { getAuthMessageStatus } from '../utils/authMessageStatus';

function AuthStatusMessage({ message, status }) {
  if (!message) {
    return null;
  }

  const resolved = getAuthMessageStatus(message, status);
  const className = [
    'auth-status',
    resolved === 'success' ? 'is-success' : '',
    resolved === 'error' ? 'is-error' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={className} role="status">
      {message}
    </p>
  );
}

export default AuthStatusMessage;
