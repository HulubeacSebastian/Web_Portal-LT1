const store = require('../data/documentStore');
const { prisma } = require('../db/prisma');
const { allowedStatuses } = require('../validation/documentValidation');

async function listDocuments(options) {
  const query = options.query ? String(options.query).trim().toLowerCase() : '';
  const status = options.status ? String(options.status).trim() : '';

  const where = {};
  if (status && allowedStatuses.includes(status)) {
    const statusRow = await prisma.documentStatus.findUnique({ where: { name: status } });
    if (statusRow) {
      where.statusId = statusRow.id;
    }
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { issuer: { contains: query } },
      { description: { contains: query } },
      { category: { name: { contains: query } } }
    ];
  }

  const totalItems = await prisma.document.count({ where });
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / options.limit);
  const offset = (options.page - 1) * options.limit;

  const rows = await prisma.document.findMany({
    where,
    include: { category: true, status: true },
    orderBy: { id: 'asc' },
    skip: offset,
    take: options.limit
  });

  const items = rows.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category.name,
    issuer: row.issuer,
    issuedAt: row.issuedAt,
    status: row.status.name,
    description: row.description,
    ...(row.filePath ? { file_path: row.filePath } : {}),
    ...(row.uploadDate ? { upload_date: row.uploadDate.toISOString() } : {})
  }));

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

async function getDocument(id) {
  return store.getDocumentById(id);
}

async function addDocument(payload) {
  return store.createDocument(payload);
}

async function addUploadedDocument(payload) {
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

async function editDocument(id, payload) {
  return store.updateDocument(id, payload);
}

async function removeDocument(id) {
  return store.deleteDocument(id);
}

async function attachDocumentFile(id, fileInput) {
  const fileStorage = require('./documentFileStorage');
  const paths = await fileStorage.saveDocumentFile(id, fileInput);
  return store.updateDocument(id, paths);
}

async function buildStatistics() {
  const [totalDocuments, statusGroups, categoryGroups] = await Promise.all([
    prisma.document.count(),
    prisma.document.groupBy({
      by: ['statusId'],
      _count: { _all: true }
    }),
    prisma.document.groupBy({
      by: ['categoryId'],
      _count: { _all: true }
    })
  ]);

  const statuses = await prisma.documentStatus.findMany();
  const categories = await prisma.documentCategory.findMany();
  const statusNameById = Object.fromEntries(statuses.map((row) => [row.id, row.name]));
  const categoryNameById = Object.fromEntries(categories.map((row) => [row.id, row.name]));

  const byStatus = statusGroups.reduce((acc, group) => {
    const name = statusNameById[group.statusId];
    if (name) acc[name] = group._count._all;
    return acc;
  }, {});

  const byCategory = categoryGroups.reduce((acc, group) => {
    const name = categoryNameById[group.categoryId];
    if (name) acc[name] = group._count._all;
    return acc;
  }, {});

  return {
    totalDocuments,
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
  attachDocumentFile,
  buildStatistics
};
