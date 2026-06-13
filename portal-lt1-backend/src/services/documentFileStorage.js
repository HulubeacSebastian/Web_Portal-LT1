const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(__dirname, '../../uploads');
const MAX_BYTES = 12 * 1024 * 1024;

function ensureUploadsDir() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
}

function extensionFromMime(mime, name) {
  const lower = String(mime || '').toLowerCase();
  if (lower.includes('pdf')) return 'pdf';
  if (lower.includes('png')) return 'png';
  if (lower.includes('jpeg') || lower.includes('jpg')) return 'jpg';
  const fromName = String(name || '').split('.').pop();
  if (fromName && /^[a-z0-9]+$/i.test(fromName)) return fromName.toLowerCase();
  return 'bin';
}

function decodeDataUrl(dataUrl) {
  const raw = String(dataUrl || '').trim();
  const match = /^data:([^;]+);base64,(.+)$/.exec(raw);
  if (!match) {
    return { error: 'Format fisier invalid (base64).' };
  }
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0) {
    return { error: 'Fisierul este gol.' };
  }
  if (buffer.length > MAX_BYTES) {
    return { error: 'Fisierul depaseste 12 MB.' };
  }
  return { mime: match[1], buffer };
}

async function saveDocumentFile(documentId, { dataUrl, name, type }) {
  const decoded = decodeDataUrl(dataUrl);
  if (decoded.error) {
    const err = new Error(decoded.error);
    err.statusCode = 400;
    throw err;
  }

  ensureUploadsDir();
  const ext = extensionFromMime(decoded.mime || type, name);
  const filename = `${documentId}.${ext}`;
  const absolutePath = path.join(uploadsDir, filename);
  fs.writeFileSync(absolutePath, decoded.buffer);

  return {
    file_path: `/uploads/${filename}`,
    upload_date: new Date().toISOString()
  };
}

module.exports = {
  uploadsDir,
  saveDocumentFile
};
