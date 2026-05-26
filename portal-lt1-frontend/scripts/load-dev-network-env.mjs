import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));

export function resolveDevNetworkEnvPaths() {
  const frontendDir = path.resolve(scriptDir, '..');
  const repoRoot = path.resolve(frontendDir, '..');
  return [
    path.join(repoRoot, 'dev-network.local.env'),
    path.join(frontendDir, 'dev-network.local.env'),
    path.join(repoRoot, 'dev-network.env'),
    path.join(frontendDir, 'dev-network.env'),
    path.join(process.cwd(), 'dev-network.env'),
    path.join(process.cwd(), '..', 'dev-network.env')
  ];
}

export function findDevNetworkEnvPath() {
  for (const envPath of resolveDevNetworkEnvPaths()) {
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }
  return null;
}

function parseEnvContent(content) {
  let text = content;
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    const hash = value.indexOf('#');
    if (hash >= 0) {
      value = value.slice(0, hash).trim();
    }
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

export function loadDevNetworkEnv() {
  const envPath = findDevNetworkEnvPath();
  if (!envPath) {
    return {};
  }
  return parseEnvContent(fs.readFileSync(envPath, 'utf8'));
}

export function loadDevNetworkEnvMeta() {
  const envPath = findDevNetworkEnvPath();
  if (!envPath) {
    return { values: {}, path: null, searched: resolveDevNetworkEnvPaths() };
  }
  return {
    values: parseEnvContent(fs.readFileSync(envPath, 'utf8')),
    path: envPath,
    searched: resolveDevNetworkEnvPaths()
  };
}
