const path = require('path');
const { createRequire } = require('module');

const testsRoot = __dirname;
const frontendRoot = path.resolve(testsRoot, '../../portal-lt1-frontend');
const requireFromFrontend = createRequire(path.join(frontendRoot, 'package.json'));
const { defineConfig } = requireFromFrontend('@playwright/test');

module.exports = defineConfig({
  testDir: path.join(testsRoot, 'e2e'),
  use: {
    baseURL: 'http://127.0.0.1:4173'
  },
  webServer: [
    {
      command: 'npm start',
      url: 'http://127.0.0.1:3000/health',
      cwd: path.resolve(testsRoot, '../../portal-lt1-backend'),
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        ...process.env,
        AUTH_EXPOSE_DEV_CODES: 'true',
        NODE_ENV: 'test'
      }
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4173',
      url: 'http://127.0.0.1:4173',
      cwd: frontendRoot,
      reuseExistingServer: !process.env.CI,
      timeout: 120000
    }
  ]
});
