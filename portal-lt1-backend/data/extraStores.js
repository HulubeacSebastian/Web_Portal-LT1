const initialUsers = [
  {
    id: 'USR-001',
    email: 'admin@lt1.ro',
    password: 'admin123',
    fullName: 'Administrator LT1',
    role: 'admin'
  },
  {
    id: 'USR-002',
    email: 'profesor@lt1.ro',
    password: 'profesor123',
    fullName: 'Profesor LT1',
    role: 'teacher'
  }
];

const initialPosts = [
  {
    id: 'POST-001',
    title: 'Deschiderea noului an scolar',
    content: 'Liceul Tehnologic Nr. 1 anunta deschiderea noului an scolar.',
    category_id: 'news',
    image_url: '',
    is_published: true,
    author_id: 'USR-001',
    created_at: '2026-04-01T08:00:00.000Z'
  }
];

const initialContactMessages = [];

let users = initialUsers.map((user) => ({ ...user }));
let posts = initialPosts.map((post) => ({ ...post }));
let contactMessages = initialContactMessages.map((message) => ({ ...message }));
let nextPostId = posts.length + 1;
let nextMessageId = contactMessages.length + 1;

function resetExtraStores() {
  users = initialUsers.map((user) => ({ ...user }));
  posts = initialPosts.map((post) => ({ ...post }));
  contactMessages = initialContactMessages.map((message) => ({ ...message }));
  nextPostId = posts.length + 1;
  nextMessageId = contactMessages.length + 1;
}

function getUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase()) || null;
}

function getUserById(id) {
  return users.find((user) => user.id === id) || null;
}

function listPosts(categoryId) {
  if (!categoryId) return posts;
  return posts.filter((post) => post.category_id === categoryId);
}

function createPost(payload) {
  const post = {
    id: `POST-${String(nextPostId).padStart(3, '0')}`,
    ...payload,
    is_published: payload.is_published !== false,
    created_at: new Date().toISOString()
  };
  nextPostId += 1;
  posts.unshift(post);
  return post;
}

function updatePost(id, payload) {
  const idx = posts.findIndex((post) => post.id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...payload, id };
  return posts[idx];
}

function deletePost(id) {
  const idx = posts.findIndex((post) => post.id === id);
  if (idx === -1) return false;
  posts.splice(idx, 1);
  return true;
}

function createContactMessage(payload) {
  const message = {
    id: `MSG-${String(nextMessageId).padStart(3, '0')}`,
    ...payload,
    sent_at: new Date().toISOString()
  };
  nextMessageId += 1;
  contactMessages.unshift(message);
  return message;
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
