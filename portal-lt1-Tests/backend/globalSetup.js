const path = require('path');
const { execSync } = require('child_process');

module.exports = async function globalSetup() {
  const backendRoot = path.join(__dirname, '../../portal-lt1-backend');
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/test.db';
  process.env.NODE_ENV = 'test';

  execSync('npx prisma generate', { cwd: backendRoot, stdio: 'inherit' });
  execSync('npx prisma migrate deploy', { cwd: backendRoot, stdio: 'inherit', env: process.env });
  execSync('node prisma/seed.js', { cwd: backendRoot, stdio: 'inherit', env: process.env });
};
