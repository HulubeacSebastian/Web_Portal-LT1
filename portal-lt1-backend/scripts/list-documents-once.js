require('./load-dotenv').loadAppEnv();
const { prisma } = require('../src/db/prisma');

prisma.document
  .findMany({ orderBy: { id: 'asc' }, select: { id: true, title: true, filePath: true } })
  .then((rows) => {
    console.log(JSON.stringify(rows, null, 2));
  })
  .finally(() => prisma.$disconnect());
