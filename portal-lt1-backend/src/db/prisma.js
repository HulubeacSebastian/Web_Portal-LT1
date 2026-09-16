const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');

const globalForPrisma = global;
const PRISMA_DIR = path.join(__dirname, '../../prisma');

// Prisma's native engine (CLI: migrate/db push) resolves relative "file:" sqlite
// paths against the folder containing schema.prisma, regardless of the process'
// current working directory. The libSQL driver resolves them against the CWD
// instead. Mirroring the native convention here keeps both engines pointed at
// the exact same physical file no matter where a script is launched from.
function resolveDatabaseUrl(rawUrl) {
  if (!rawUrl.startsWith('file:')) {
    return rawUrl;
  }
  const relativePath = rawUrl.slice('file:'.length);
  if (path.isAbsolute(relativePath)) {
    return rawUrl;
  }
  return `file:${path.resolve(PRISMA_DIR, relativePath)}`;
}

function createPrismaClient() {
  const url = resolveDatabaseUrl(process.env.DATABASE_URL || 'file:./dev.db');
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const adapter = new PrismaLibSQL({ url, authToken });
  return new PrismaClient({ adapter });
}

const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
