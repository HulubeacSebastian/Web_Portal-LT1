const { prisma } = require('../../portal-lt1-backend/src/db/prisma');

module.exports = async function globalTeardown() {
  await prisma.$disconnect();
};
