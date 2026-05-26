import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getLocalIPv4Addresses,
  isClientMachine,
  validateClientNetworkEnv
} from './detect-dev-role.mjs';
import {
  findDevNetworkEnvPath,
  loadDevNetworkEnv,
  resolveDevNetworkEnvPaths
} from './load-dev-network-env.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(scriptDir, '..');
const devNetworkPath = findDevNetworkEnvPath();
const networkEnv = loadDevNetworkEnv();
const localIps = getLocalIPv4Addresses();
const onClient = isClientMachine(networkEnv, localIps);

if (!devNetworkPath) {
  console.error(
    '\n  EROARE: lipseste dev-network.env.\n' +
      '  Salveaza fisierul la una din locatiile:\n' +
      resolveDevNetworkEnvPaths()
        .map((p) => `    - ${p}`)
        .join('\n') +
      '\n'
  );
  process.exit(1);
}

console.log(`\n  dev-network.env: ${devNetworkPath}`);
console.log(`  SERVER_IP=${networkEnv.SERVER_IP || '(lipseste)'}\n`);

const validationError = validateClientNetworkEnv(networkEnv, localIps);
if (validationError) {
  console.error(`\n  EROARE: ${validationError}\n`);
  process.exit(1);
}

const env = {
  ...process.env,
  VITE_DEV_HTTPS: 'true'
};

if (onClient || networkEnv.VITE_USE_DEV_PROXY === 'false') {
  env.VITE_USE_DEV_PROXY = 'false';
}

if (onClient) {
  const serverIp = networkEnv.SERVER_IP.trim();
  console.log(`\n  Mod CLIENT: API direct → https://${serverIp}:3000\n`);
}

const viteBin = path.join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
const child = spawn(process.execPath, [viteBin], {
  cwd: frontendDir,
  env,
  stdio: 'inherit'
});

child.on('exit', (code) => process.exit(code ?? 0));
