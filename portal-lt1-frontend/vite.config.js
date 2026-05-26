import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import {
  findDevNetworkEnvPath,
  loadDevNetworkEnv,
  resolveDevNetworkEnvPaths
} from './scripts/load-dev-network-env.mjs';
import { isClientMachine, validateClientNetworkEnv } from './scripts/detect-dev-role.mjs';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const certDir = path.resolve(rootDir, '../portal-lt1-backend/certs');

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

function shouldUseDevProxy(mode, env, networkEnv) {
  if (mode !== 'development') {
    return false;
  }
  if (env.VITE_USE_DEV_PROXY === 'false' || networkEnv.VITE_USE_DEV_PROXY === 'false') {
    return false;
  }
  if (env.VITE_USE_DEV_PROXY === 'true' || networkEnv.VITE_USE_DEV_PROXY === 'true') {
    return true;
  }
  const envPath = findDevNetworkEnvPath() || '';
  if (envPath.includes('dev-network.local.env')) {
    return true;
  }
  return false;
}

function resolveProxyTarget(env, networkEnv, useDevProxy) {
  if (env.VITE_PROXY_TARGET?.trim()) {
    return env.VITE_PROXY_TARGET.trim().replace(/\/$/, '');
  }
  const envPath = findDevNetworkEnvPath() || '';
  if (useDevProxy && envPath.includes('dev-network.local.env')) {
    return 'http://127.0.0.1:3000';
  }
  const serverIp = networkEnv.SERVER_IP?.trim() || '127.0.0.1';
  const backendHttp =
    networkEnv.BACKEND_HTTP === 'true' || env.BACKEND_HTTP === 'true';
  const protocol = backendHttp ? 'http' : 'https';
  return `${protocol}://${serverIp}:3000`;
}

function resolveApiBaseUrl(mode, env, networkEnv, useDevProxy) {
  if (useDevProxy) {
    return '';
  }
  if (env.VITE_API_BASE_URL?.trim()) {
    return env.VITE_API_BASE_URL.trim().replace(/\/$/, '');
  }
  if (mode !== 'development') {
    return '';
  }
  const serverIp = networkEnv.SERVER_IP?.trim();
  if (serverIp) {
    const backendHttp =
      networkEnv.BACKEND_HTTP === 'true' || env.BACKEND_HTTP === 'true';
    const protocol = backendHttp ? 'http' : 'https';
    return `${protocol}://${serverIp}:3000`;
  }
  return '';
}

function pickPrimaryLanIp(networkEnv, localIps) {
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, '');
  const networkEnv = loadDevNetworkEnv();
  const localIps = getLocalIPv4Addresses();
  const useHttps = env.VITE_DEV_HTTPS === 'true';
  const lanHost = env.VITE_LAN_HOST || networkEnv.VITE_LAN_HOST || networkEnv.CLIENT_IP || '';
  const useDevProxy = shouldUseDevProxy(mode, env, networkEnv);

  const clientValidationError = validateClientNetworkEnv(networkEnv, localIps);
  if (clientValidationError) {
    throw new Error(clientValidationError);
  }

  if (!findDevNetworkEnvPath()) {
    throw new Error(
      'Nu gasesc dev-network.env.\n' +
        '  Salveaza fisierul la: ' +
        resolveDevNetworkEnvPaths()[0] +
        '\n  (sau dev-network.local.env pentru offline)'
    );
  }

  const serverIpFromEnv = networkEnv.SERVER_IP?.trim();
  if (
    !serverIpFromEnv &&
    (isClientMachine(networkEnv, localIps) || env.VITE_USE_DEV_PROXY === 'false')
  ) {
    throw new Error(
      'dev-network.env exista dar SERVER_IP lipseste. Adauga: SERVER_IP=192.168.0.81'
    );
  }
  if (
    mode === 'development' &&
    !useDevProxy &&
    (serverIpFromEnv === '127.0.0.1' || serverIpFromEnv === 'localhost')
  ) {
    throw new Error(
      'SERVER_IP=127.0.0.1 este gresit pentru dev LAN/HTTPS. Pentru offline: dev-network.local.env sau .env.development cu VITE_USE_DEV_PROXY=true.'
    );
  }

  const apiBaseFromNetwork = resolveApiBaseUrl(mode, env, networkEnv, useDevProxy);
  const proxyTarget = resolveProxyTarget(env, networkEnv, useDevProxy);
  const httpsOptions = useHttps ? loadHttpsOptions() : false;
  const frontendOnClientMachine = Boolean(lanHost && localIps.includes(lanHost));
  const disableHmr =
    env.VITE_DISABLE_HMR === 'true' || networkEnv.VITE_DISABLE_HMR === 'true';

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

  function printLanUrls() {
    return {
      name: 'portal-lt1-print-urls',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const port = 5173;
          const protocol = useHttps ? 'https' : 'http';
          const primaryIp = pickPrimaryLanIp(networkEnv, localIps);
          const lines = [`\n  Portal LT1: ${protocol}://localhost:${port}/`];
          if (primaryIp) {
            lines.push(`  Retea (acelasi PC / LAN): ${protocol}://${primaryIp}:${port}/`);
          }
          const envPath = findDevNetworkEnvPath();
          if (!envPath) {
            lines.push('  ATENTIE: lipseste dev-network.env — copiaza-l de pe PC.');
          } else {
            lines.push(`  Config retea: ${envPath}`);
          }
          if (useDevProxy) {
            lines.push(`  Mod: proxy Vite → ${proxyTarget}`);
          } else if (apiBaseFromNetwork) {
            lines.push(`  Mod: API direct → ${apiBaseFromNetwork}`);
          }
          lines.push('');
          console.log(lines.join('\n'));
        });
      }
    };
  }

  return {
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
  };
});
