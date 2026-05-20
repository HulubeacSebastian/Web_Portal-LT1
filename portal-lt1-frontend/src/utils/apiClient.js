const DEFAULT_API_ORIGIN = 'http://localhost:3000';

function resolveUrl(path) {
  if (typeof path !== 'string') return DEFAULT_API_ORIGIN;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${DEFAULT_API_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export async function apiRequest(path, options = {}) {
  const url = resolveUrl(path);
  const method = options.method || 'GET';
  const headers = new Headers(options.headers || {});

  const init = { method, headers };

  if (options.body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
  }

  const response = await fetch(url, init);
  const contentType = response.headers.get('content-type') || '';

  let data;
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => undefined);
  } else {
    data = await response.text().catch(() => '');
  }

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data && String(data.message)) ||
      (typeof data === 'string' && data) ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

