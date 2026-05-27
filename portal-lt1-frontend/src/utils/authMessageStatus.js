export function getAuthMessageStatus(message, explicitStatus) {
  if (explicitStatus === 'success' || explicitStatus === 'error') {
    return explicitStatus;
  }
  if (!message) {
    return null;
  }

  const lower = message.toLowerCase();
  if (
    lower.includes('reusit') ||
    lower.includes('succes') ||
    lower.includes('trimis') ||
    lower.includes('actualizat') ||
    lower.includes('creat')
  ) {
    return 'success';
  }

  return 'error';
}
