import { getApiOrigin, getFilesOrigin } from './apiClient';

export function resolveDocumentFileUrl(document) {
  if (!document) return '';
  if (document.file?.dataUrl) return document.file.dataUrl;
  if (document.file_path) {
    const base = getFilesOrigin();
    return `${base}${document.file_path.startsWith('/') ? '' : '/'}${document.file_path}`;
  }
  if (document.fileUrl) return document.fileUrl;
  return '';
}

export { getApiOrigin };
