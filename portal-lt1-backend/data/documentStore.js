const { seedDocuments } = require('./seedDocuments');

let documents = seedDocuments.map((document) => ({ ...document }));
let nextId = documents.length + 1;

function buildDocumentId() {
  const padded = String(nextId).padStart(3, '0');
  nextId += 1;
  return `DOC-${padded}`;
}

function resetStore() {
  documents = seedDocuments.map((document) => ({ ...document }));
  nextId = documents.length + 1;
}

function getAllDocuments() {
  return documents;
}

function getDocumentById(id) {
  return documents.find((document) => document.id === id) || null;
}

function createDocument(payload) {
  const document = {
    id: buildDocumentId(),
    ...payload
  };
  documents.unshift(document);
  return document;
}

function updateDocument(id, payload) {
  const index = documents.findIndex((document) => document.id === id);
  if (index === -1) {
    return null;
  }

  documents[index] = {
    ...documents[index],
    ...payload,
    id
  };

  return documents[index];
}

function deleteDocument(id) {
  const index = documents.findIndex((document) => document.id === id);
  if (index === -1) {
    return false;
  }

  documents.splice(index, 1);
  return true;
}

module.exports = {
  resetStore,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
};
