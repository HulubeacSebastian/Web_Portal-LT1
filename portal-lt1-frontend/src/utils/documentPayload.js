/** Payload trimis la API — fara fisiere base64 (evita entity.too.large). */
export function toApiDocumentPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return {};
  }
  const api = {
    title: payload.title,
    category: payload.category,
    issuer: payload.issuer,
    issuedAt: payload.issuedAt,
    status: payload.status,
    description: payload.description
  };
  if (payload.file_path) {
    api.file_path = payload.file_path;
  }
  return api;
}
