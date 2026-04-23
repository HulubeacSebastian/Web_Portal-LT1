const store = require('../data/documentStore');
const { allowedStatuses } = require('../validation/documentValidation');

function listDocuments(options) {
  const query = options.query ? String(options.query).trim().toLowerCase() : '';
  const status = options.status ? String(options.status).trim() : '';

  let filtered = store.getAllDocuments();

  if (query) {
    filtered = filtered.filter((document) => {
      return (
        document.title.toLowerCase().includes(query) ||
        document.category.toLowerCase().includes(query) ||
        document.issuer.toLowerCase().includes(query) ||
        document.description.toLowerCase().includes(query)
      );
    });
  }

  if (status && allowedStatuses.includes(status)) {
    filtered = filtered.filter((document) => document.status === status);
  }

  const totalItems = filtered.length;
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / options.limit);
  const offset = (options.page - 1) * options.limit;
  const items = filtered.slice(offset, offset + options.limit);

  return {
    items,
    pagination: {
      page: options.page,
      limit: options.limit,
      totalItems,
      totalPages,
      hasNextPage: options.page < totalPages,
      hasPreviousPage: options.page > 1 && totalPages > 0
    }
  };
}

function getDocument(id) {
  return store.getDocumentById(id);
}

function addDocument(payload) {
  return store.createDocument(payload);
}

function addUploadedDocument(payload) {
  return store.createDocument({
    title: payload.title,
    category: payload.category,
    issuer: payload.issuer,
    issuedAt: new Date().toISOString().slice(0, 10),
    status: 'Activ',
    description: payload.description || `Fisier incarcat: ${payload.file_path}`,
    file_path: payload.file_path,
    upload_date: new Date().toISOString()
  });
}

function editDocument(id, payload) {
  return store.updateDocument(id, payload);
}

function removeDocument(id) {
  return store.deleteDocument(id);
}

function buildStatistics() {
  const documents = store.getAllDocuments();
  const byStatus = documents.reduce(
    (acc, document) => {
      acc[document.status] = (acc[document.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const byCategory = documents.reduce((acc, document) => {
    acc[document.category] = (acc[document.category] || 0) + 1;
    return acc;
  }, {});

  return {
    totalDocuments: documents.length,
    byStatus,
    byCategory
  };
}

module.exports = {
  listDocuments,
  getDocument,
  addDocument,
  addUploadedDocument,
  editDocument,
  removeDocument,
  buildStatistics
};
