import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const certDir = path.resolve(rootDir, '../portal-lt1-backend/certs');
const useHttps = process.env.VITE_DEV_HTTPS === 'true';

function loadHttpsOptions() {
  const keyFile = path.join(certDir, 'dev.key');
  const certFile = path.join(certDir, 'dev.crt');

  if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
    console.warn(
      '[vite] Lipsesc certificatele TLS. Ruleaza: npm run cert:generate --prefix portal-lt1-backend'
    );
    return false;
  }

  return {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
  };
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: useHttps ? loadHttpsOptions() : false
  }
});
