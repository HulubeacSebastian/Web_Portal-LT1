export function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodeURIComponent(name)}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

export function setCookie(name, value, options = {}) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];

  if (options.maxAge) {
    parts.push(`max-age=${options.maxAge}`);
  }
  if (options.path) {
    parts.push(`path=${options.path}`);
  } else {
    parts.push('path=/');
  }
  if (options.sameSite) {
    parts.push(`samesite=${options.sameSite}`);
  }

  document.cookie = parts.join('; ');
}

export function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
}

