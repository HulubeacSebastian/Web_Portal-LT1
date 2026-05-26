const { prisma } = require('../../portal-lt1-backend/src/db/prisma');
const { closeMongo } = require('../../portal-lt1-backend/src/chat/mongoClient');

module.exports = async function globalTeardown() {
  await closeMongo();
  await prisma.$disconnect();

  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
    global.__MONGOD__ = null;
  }
};
