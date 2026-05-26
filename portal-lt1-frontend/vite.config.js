import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadDevNetworkEnv } from './scripts/load-dev-network-env.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const certDir = path.resolve(rootDir, '../portal-lt1-backend/certs');
const networkEnv = loadDevNetworkEnv();
const useHttps = process.env.VITE_DEV_HTTPS === 'true';
const lanHost = process.env.VITE_LAN_HOST || networkEnv.VITE_LAN_HOST || networkEnv.CLIENT_IP || '';

const useDevProxy =
  process.env.VITE_USE_DEV_PROXY !== 'false' && networkEnv.VITE_USE_DEV_PROXY !== 'false';

function getLocalIPv4Addresses() {
  const addresses = new Set();
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const entry of iface || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.add(entry.address);
      }
    }
  }
  return Array.from(addresses);
}

function loadHttpsOptions() {
  const keyFile = path.join(certDir, 'dev.key');
  const certFile = path.join(certDir, 'dev.crt');

  if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
    throw new Error(
      'Lipsesc certificatele TLS. Ruleaza: npm run prepare:dev-tls din radacina proiectului.'
    );
  }

  return {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
  };
}

function resolveProxyTarget() {
  if (process.env.VITE_PROXY_TARGET?.trim()) {
    return process.env.VITE_PROXY_TARGET.trim().replace(/\/$/, '');
  }
  const serverIp = networkEnv.SERVER_IP?.trim() || '127.0.0.1';
  const backendHttp =
    networkEnv.BACKEND_HTTP === 'true' || process.env.BACKEND_HTTP === 'true';
  const protocol = backendHttp ? 'http' : 'https';
  return `${protocol}://${serverIp}:3000`;
}

function resolveApiBaseUrl() {
  if (useDevProxy) {
    return '';
  }
  if (process.env.VITE_API_BASE_URL?.trim()) {
    return process.env.VITE_API_BASE_URL.trim().replace(/\/$/, '');
  }
  const serverIp = networkEnv.SERVER_IP?.trim();
  if (serverIp) {
    const backendHttp =
      networkEnv.BACKEND_HTTP === 'true' || process.env.BACKEND_HTTP === 'true';
    const protocol = backendHttp ? 'http' : 'https';
    return `${protocol}://${serverIp}:3000`;
  }
  return '';
}

const apiBaseFromNetwork = resolveApiBaseUrl();
const proxyTarget = resolveProxyTarget();
const httpsOptions = useHttps ? loadHttpsOptions() : false;
const localIps = getLocalIPv4Addresses();
const frontendOnClientMachine = Boolean(lanHost && localIps.includes(lanHost));
const disableHmr =
  process.env.VITE_DISABLE_HMR === 'true' || networkEnv.VITE_DISABLE_HMR === 'true';

let hmrConfig;
if (disableHmr) {
  hmrConfig = false;
} else if (useHttps) {
  hmrConfig = frontendOnClientMachine
    ? { host: lanHost, port: 5173, protocol: 'wss' }
    : { protocol: 'wss', port: 5173 };
} else {
  hmrConfig = undefined;
}

const defineEnv = {
  'import.meta.env.VITE_USE_DEV_PROXY': JSON.stringify(useDevProxy ? 'true' : 'false'),
  'import.meta.env.VITE_SERVER_IP': JSON.stringify(networkEnv.SERVER_IP?.trim() || '127.0.0.1')
};
if (apiBaseFromNetwork) {
  defineEnv['import.meta.env.VITE_API_BASE_URL'] = JSON.stringify(apiBaseFromNetwork);
}

const devProxy = useDevProxy
  ? {
      '/api': { target: proxyTarget, changeOrigin: true, secure: false },
      '/health': { target: proxyTarget, changeOrigin: true, secure: false }
    }
  : undefined;

function pickPrimaryLanIp() {
  const configured = [networkEnv.CLIENT_IP, networkEnv.SERVER_IP]
    .map((value) => value?.trim())
    .filter(Boolean);
  for (const ip of configured) {
    if (localIps.includes(ip)) return ip;
  }
  return (
    localIps.find((ip) => ip.startsWith('192.168.0.')) ||
    localIps.find((ip) => !ip.startsWith('192.168.56.')) ||
    localIps[0]
  );
}

function printLanUrls() {
  return {
    name: 'portal-lt1-print-urls',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const port = 5173;
        const protocol = useHttps ? 'https' : 'http';
        const primaryIp = pickPrimaryLanIp();
        const lines = [`\n  Portal LT1: ${protocol}://localhost:${port}/`];
        if (primaryIp) {
          lines.push(`  Retea (acelasi PC / LAN): ${protocol}://${primaryIp}:${port}/`);
        }
        if (useDevProxy) {
          lines.push(`  API proxy → ${proxyTarget}`);
        } else if (networkEnv.SERVER_IP?.trim()) {
          const backendHttp =
            networkEnv.BACKEND_HTTP === 'true' || process.env.BACKEND_HTTP === 'true';
          const apiProtocol = backendHttp ? 'http' : 'https';
          lines.push(
            `  API (Assignment 4): ${apiProtocol}://${networkEnv.SERVER_IP.trim()}:3000`
          );
        }
        lines.push('');
        console.log(lines.join('\n'));
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), printLanUrls()],
  define: defineEnv,
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https: httpsOptions,
    hmr: hmrConfig,
    proxy: devProxy || undefined
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    https: fs.existsSync(path.join(certDir, 'dev.key')) ? loadHttpsOptions() : false
  }
});
