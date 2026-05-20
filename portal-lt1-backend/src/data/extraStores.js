const { prisma } = require('../db/prisma');
const { mapUser, mapPost, mapContactMessage } = require('../db/mappers');

async function resetExtraStores() {
  const { resetDatabase } = require('../db/reset');
  await resetDatabase();
}

async function getUserByEmail(email) {
  const row = await prisma.user.findUnique({
    where: { email: String(email).toLowerCase() },
    include: { role: true }
  });
  return mapUser(row);
}

async function getUserById(id) {
  const row = await prisma.user.findUnique({
    where: { id },
    include: { role: true }
  });
  return mapUser(row);
}

async function listPosts(categoryId) {
  const rows = await prisma.post.findMany({
    where: categoryId ? { categoryId: String(categoryId) } : undefined,
    orderBy: { createdAt: 'desc' }
  });
  return rows.map(mapPost);
}

async function buildPostId() {
  const last = await prisma.post.findFirst({
    where: { id: { startsWith: 'POST-' } },
    orderBy: { id: 'desc' }
  });
  const next = last ? Number.parseInt(last.id.replace('POST-', ''), 10) + 1 : 1;
  return `POST-${String(next).padStart(3, '0')}`;
}

async function ensurePostCategory(categoryId) {
  const id = String(categoryId).trim();
  if (!id) return id;
  await prisma.postCategory.upsert({
    where: { id },
    update: {},
    create: { id, name: id }
  });
  return id;
}

async function createPost(payload) {
  const categoryId = await ensurePostCategory(payload.category_id);
  const id = await buildPostId();

  const row = await prisma.post.create({
    data: {
      id,
      title: payload.title,
      content: payload.content,
      categoryId,
      imageUrl: payload.image_url || '',
      isPublished: payload.is_published !== false,
      authorId: payload.author_id,
      createdAt: new Date()
    }
  });

  return mapPost(row);
}

async function updatePost(id, payload) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;

  const categoryId = payload.category_id
    ? await ensurePostCategory(payload.category_id)
    : existing.categoryId;

  const row = await prisma.post.update({
    where: { id },
    data: {
      title: payload.title,
      content: payload.content,
      categoryId,
      imageUrl: payload.image_url !== undefined ? payload.image_url : existing.imageUrl,
      isPublished: payload.is_published !== undefined ? payload.is_published : existing.isPublished
    }
  });

  return mapPost(row);
}

async function deletePost(id) {
  try {
    await prisma.post.delete({ where: { id } });
    return true;
  } catch (error) {
    if (error.code === 'P2025') return false;
    throw error;
  }
}

async function buildMessageId() {
  const last = await prisma.contactMessage.findFirst({
    where: { id: { startsWith: 'MSG-' } },
    orderBy: { id: 'desc' }
  });
  const next = last ? Number.parseInt(last.id.replace('MSG-', ''), 10) + 1 : 1;
  return `MSG-${String(next).padStart(3, '0')}`;
}

async function createContactMessage(payload) {
  const id = await buildMessageId();
  const row = await prisma.contactMessage.create({
    data: {
      id,
      senderEmail: payload.sender_email,
      message: payload.message,
      sentAt: new Date()
    }
  });
  return mapContactMessage(row);
}

module.exports = {
  resetExtraStores,
  getUserByEmail,
  getUserById,
  listPosts,
  createPost,
  updatePost,
  deletePost,
  createContactMessage
};
