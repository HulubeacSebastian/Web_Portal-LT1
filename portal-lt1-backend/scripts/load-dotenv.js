const path = require('path');
const fs = require('fs');

function loadEnvFile(filePath, override) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  require('dotenv').config({ path: filePath, override: override === true });
}

/** Incarca portal-lt1-backend/.env apoi .env.local (optional, override). */
function loadAppEnv() {
  const root = path.resolve(__dirname, '..');
  loadEnvFile(path.join(root, '.env'), false);
  loadEnvFile(path.join(root, '.env.local'), true);
}

module.exports = { loadAppEnv };
