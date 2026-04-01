import { createContext, useContext, useMemo, useState } from 'react';
import { seedDocuments } from '../data/seedDocuments';

const DocumentsContext = createContext(null);

export function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState(seedDocuments);

  const addDocument = (payload) => {
    const id = `DOC-${String(Date.now()).slice(-6)}`;
    const next = { ...payload, id };
    setDocuments((prev) => [next, ...prev]);
    return id;
  };

  const updateDocument = (id, payload) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, ...payload } : doc)));
  };

  const deleteDocument = (id) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const getDocumentById = (id) => documents.find((doc) => doc.id === id);

  const value = useMemo(
    () => ({
      documents,
      addDocument,
      updateDocument,
      deleteDocument,
      getDocumentById
    }),
    [documents]
  );

  return <DocumentsContext.Provider value={value}>{children}</DocumentsContext.Provider>;
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used inside DocumentsProvider');
  }
  return context;
}
