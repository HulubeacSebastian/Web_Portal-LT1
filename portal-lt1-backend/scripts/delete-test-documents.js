require('./load-dotenv').loadAppEnv();
const fs = require('fs');
const path = require('path');
const { prisma } = require('../src/db/prisma');

const GENERATOR_IDS = Array.from({ length: 8 }, (_, i) => `DOC-${String(13 + i).padStart(3, '0')}`);

const uploadsDir = path.resolve(__dirname, '../uploads');

async function main() {
  const toDelete = await prisma.document.findMany({
    where: {
      OR: [{ title: 'test' }, { title: 'atest' }, { id: { in: GENERATOR_IDS } }]
    },
    select: { id: true, title: true, filePath: true }
  });

  if (toDelete.length === 0) {
    console.log('Nimic de sters.');
    return;
  }

  console.log(`Sterg ${toDelete.length} documente:`);
  for (const row of toDelete) {
    console.log(`  ${row.id} — ${row.title}`);
    if (row.filePath) {
      const name = path.basename(row.filePath);
      const file = path.join(uploadsDir, name);
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`    fisier sters: ${name}`);
      }
    }
  }

  const result = await prisma.document.deleteMany({
    where: {
      OR: [{ title: 'test' }, { title: 'atest' }, { id: { in: GENERATOR_IDS } }]
    }
  });

  console.log(`Gata: ${result.count} documente sterse.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
