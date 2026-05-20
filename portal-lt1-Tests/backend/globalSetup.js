const path = require('path');
const { execSync } = require('child_process');

const backendRoot = path.join(__dirname, '../../portal-lt1-backend');
const { MongoMemoryServer } = require(path.join(backendRoot, 'node_modules/mongodb-memory-server'));

let mongod;

module.exports = async function globalSetup() {
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/test.db';
  process.env.NODE_ENV = 'test';

  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.MONGODB_DB = 'portal_lt1_chat_test';

  global.__MONGOD__ = mongod;

  try {
    execSync('npx prisma generate', { cwd: backendRoot, stdio: 'inherit' });
  } catch {
    // Prisma client deja generat sau fisier blocat de un server pornit.
  }
  execSync('npx prisma migrate deploy', { cwd: backendRoot, stdio: 'inherit', env: process.env });
  execSync('node prisma/seed.js', { cwd: backendRoot, stdio: 'inherit', env: process.env });
};
