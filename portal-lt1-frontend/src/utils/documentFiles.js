const FILES_KEY = 'portal_document_files';

function loadMap() {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveMap(map) {
  try {
    localStorage.setItem(FILES_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}

export function getDocumentFile(docId) {
  if (!docId) return null;
  return loadMap()[docId] || null;
}

export function setDocumentFile(docId, file) {
  if (!docId) return;
  const map = loadMap();
  if (file) {
    map[docId] = file;
  } else {
    delete map[docId];
  }
  saveMap(map);
}

export function moveDocumentFile(fromId, toId) {
  if (!fromId || !toId || fromId === toId) return;
  const map = loadMap();
  if (!map[fromId]) return;
  map[toId] = map[fromId];
  delete map[fromId];
  saveMap(map);
}

export function removeDocumentFile(docId) {
  setDocumentFile(docId, null);
}

export function attachFilesToDocuments(documents) {
  if (!Array.isArray(documents)) return [];
  const map = loadMap();
  return documents.map((doc) => {
    const file = map[doc.id];
    return file ? { ...doc, file } : doc;
  });
}
