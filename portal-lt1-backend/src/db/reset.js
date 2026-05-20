const { execSync } = require('child_process');
const path = require('path');
const { prisma } = require('./prisma');

async function clearTables() {
  await prisma.contactMessage.deleteMany();
  await prisma.post.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();
  await prisma.postCategory.deleteMany();
  await prisma.documentCategory.deleteMany();
  await prisma.documentStatus.deleteMany();
  await prisma.role.deleteMany();
}

async function resetDatabase() {
  await clearTables();
  const backendRoot = path.join(__dirname, '../..');
  execSync('node prisma/seed.js', {
    cwd: backendRoot,
    stdio: 'inherit',
    env: process.env
  });
}

module.exports = {
  clearTables,
  resetDatabase
};
