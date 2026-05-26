const { prisma } = require('../db/prisma');
const { mapDocument } = require('../db/mappers');

const documentInclude = {
  category: true,
  status: true
};

function categoryIdFromName(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureCategory(name) {
  const id = categoryIdFromName(name);
  await prisma.documentCategory.upsert({
    where: { id },
    update: { name },
    create: { id, name }
  });
  return id;
}

async function ensureStatus(name) {
  const status = await prisma.documentStatus.upsert({
    where: { name },
    update: {},
    create: { name }
  });
  return status.id;
}

async function buildDocumentId() {
  const last = await prisma.document.findFirst({
    where: { id: { startsWith: 'DOC-' } },
    orderBy: { id: 'desc' }
  });

  const next = last ? Number.parseInt(last.id.replace('DOC-', ''), 10) + 1 : 1;
  return `DOC-${String(next).padStart(3, '0')}`;
}

async function resetStore() {
  const { resetDatabase } = require('../db/reset');
  await resetDatabase();
}

async function getAllDocuments() {
  const rows = await prisma.document.findMany({
    include: documentInclude,
    orderBy: { id: 'asc' }
  });
  return rows.map(mapDocument);
}

async function getDocumentById(id) {
  const row = await prisma.document.findUnique({
    where: { id },
    include: documentInclude
  });
  return mapDocument(row);
}

async function createDocument(payload) {
  const categoryId = await ensureCategory(payload.category);
  const statusId = await ensureStatus(payload.status);
  const id = await buildDocumentId();

  const row = await prisma.document.create({
    data: {
      id,
      title: payload.title,
      categoryId,
      issuer: payload.issuer,
      issuedAt: payload.issuedAt,
      statusId,
      description: payload.description,
      filePath: payload.file_path || null,
      uploadDate: payload.upload_date ? new Date(payload.upload_date) : null
    },
    include: documentInclude
  });

  return mapDocument(row);
}

async function updateDocument(id, payload) {
  const existing = await prisma.document.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  const categoryId = payload.category ? await ensureCategory(payload.category) : existing.categoryId;
  const statusId = payload.status ? await ensureStatus(payload.status) : existing.statusId;

  const row = await prisma.document.update({
    where: { id },
    data: {
      title: payload.title,
      categoryId,
      issuer: payload.issuer,
      issuedAt: payload.issuedAt,
      statusId,
      description: payload.description,
      filePath: payload.file_path !== undefined ? payload.file_path : existing.filePath,
      uploadDate: payload.upload_date ? new Date(payload.upload_date) : existing.uploadDate
    },
    include: documentInclude
  });

  return mapDocument(row);
}

async function deleteDocument(id) {
  try {
    await prisma.document.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

module.exports = {
  resetStore,
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument
};
