require('./load-dotenv').loadAppEnv();
const { getChatCollection, closeMongo } = require('../src/chat/mongoClient');

async function main() {
  const collection = await getChatCollection();
  const result = await collection.deleteMany({});
  console.log(`Sterse ${result.deletedCount} mesaje din chat.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => closeMongo());
