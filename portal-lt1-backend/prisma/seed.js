const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { seedDocuments } = require('../src/data/seedDocuments');

const prisma = new PrismaClient();

const ROLES = ['admin', 'teacher'];
const STATUSES = ['Activ', 'Revizie', 'Arhivat'];
const POST_CATEGORIES = [
  { id: 'news', name: 'Noutati' },
  { id: 'administrativ', name: 'Administrativ' },
  { id: 'evenimente', name: 'Evenimente' }
];

const USERS = [
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

const POSTS = [
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

function categoryIdFromName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function ensureLookups() {
  for (const name of ROLES) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const name of STATUSES) {
    await prisma.documentStatus.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  for (const category of POST_CATEGORIES) {
    await prisma.postCategory.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: category
    });
  }
}

async function seedUsers() {
  const roles = await prisma.role.findMany();
  const roleByName = Object.fromEntries(roles.map((role) => [role.name, role.id]));

  for (const user of USERS) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        roleId: roleByName[user.role]
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        roleId: roleByName[user.role]
      }
    });
  }
}

async function seedDocumentsData() {
  const statuses = await prisma.documentStatus.findMany();
  const statusByName = Object.fromEntries(statuses.map((status) => [status.name, status.id]));

  for (const document of seedDocuments) {
    const categoryId = categoryIdFromName(document.category);
    await prisma.documentCategory.upsert({
      where: { id: categoryId },
      update: { name: document.category },
      create: { id: categoryId, name: document.category }
    });

    await prisma.document.upsert({
      where: { id: document.id },
      update: {
        title: document.title,
        categoryId,
        issuer: document.issuer,
        issuedAt: document.issuedAt,
        statusId: statusByName[document.status],
        description: document.description
      },
      create: {
        id: document.id,
        title: document.title,
        categoryId,
        issuer: document.issuer,
        issuedAt: document.issuedAt,
        statusId: statusByName[document.status],
        description: document.description
      }
    });
  }
}

async function seedPosts() {
  for (const post of POSTS) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {
        title: post.title,
        content: post.content,
        categoryId: post.category_id,
        imageUrl: post.image_url,
        isPublished: post.is_published,
        authorId: post.author_id,
        createdAt: new Date(post.created_at)
      },
      create: {
        id: post.id,
        title: post.title,
        content: post.content,
        categoryId: post.category_id,
        imageUrl: post.image_url,
        isPublished: post.is_published,
        authorId: post.author_id,
        createdAt: new Date(post.created_at)
      }
    });
  }
}

async function main() {
  await ensureLookups();
  await seedUsers();
  await seedDocumentsData();
  await seedPosts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Database seeded.');
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
