const fs = require('fs');
const path = require('path');

function resolveDevNetworkEnvPath() {
  const repoRoot = path.resolve(__dirname, '../..');
  const candidates = [
    path.join(repoRoot, 'dev-network.local.env'),
    path.join(repoRoot, 'dev-network.env')
  ];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }
  return null;
}

function loadDevNetworkEnv() {
  const envPath = resolveDevNetworkEnvPath();
  if (!envPath) {
    return {};
  }

  const values = {};
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    values[key] = value;
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  if (values.CLIENT_IP && values.SERVER_IP) {
    const merged = new Set(
      `${values.EXTRA_DEV_IPS || ''},${values.CLIENT_IP},${values.SERVER_IP}`
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    );
    process.env.EXTRA_DEV_IPS = Array.from(merged).join(',');
  }

  return values;
}

module.exports = { loadDevNetworkEnv };
