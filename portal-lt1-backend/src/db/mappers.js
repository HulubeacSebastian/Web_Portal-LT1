function mapDocument(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    category: row.category.name,
    issuer: row.issuer,
    issuedAt: row.issuedAt,
    status: row.status.name,
    description: row.description,
    ...(row.filePath ? { file_path: row.filePath } : {}),
    ...(row.uploadDate ? { upload_date: row.uploadDate.toISOString() } : {})
  };
}

function mapPost(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category_id: row.categoryId,
    image_url: row.imageUrl,
    is_published: row.isPublished,
    author_id: row.authorId,
    created_at: row.createdAt.toISOString()
  };
}

function mapUser(row) {
  if (!row) return null;
  const permissions =
    row.role?.permissions?.map((entry) => entry.permission.code).filter(Boolean) || [];

  return {
    id: row.id,
    email: row.email,
    password: row.password,
    fullName: row.fullName,
    nickname: row.nickname || null,
    emailVerifiedAt: row.emailVerifiedAt || null,
    role: row.role.name,
    roleDescription: row.role?.description || '',
    permissions
  };
}

function mapContactMessage(row) {
  if (!row) return null;
  return {
    id: row.id,
    sender_email: row.senderEmail,
    message: row.message,
    sent_at: row.sentAt.toISOString()
  };
}

module.exports = {
  mapDocument,
  mapPost,
  mapUser,
  mapContactMessage
};
