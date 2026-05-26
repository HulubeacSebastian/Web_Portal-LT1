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
      'Lipsesc certificatele TLS din portal-lt1-backend/certs/. Ruleaza: npm run prepare:dev-tls din radacina proiectului.'
    );
  }

  return {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile)
  };
}

function printLanUrls() {
  return {
    name: 'portal-lt1-print-urls',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const port = 5173;
        const protocol = useHttps ? 'https' : 'http';
        const localIps = getLocalIPv4Addresses();
        const lines = [`\n  Portal LT1 — frontend ${protocol.toUpperCase()}:`];
        lines.push(`    ${protocol}://localhost:${port}/`);
        lines.push(`    ${protocol}://127.0.0.1:${port}/`);
        for (const ip of localIps) {
          lines.push(`    ${protocol}://${ip}:${port}/  <-- URL retea (acest PC)`);
        }
        if (lanHost && !localIps.includes(lanHost)) {
          lines.push(
            `    ATENTIE: VITE_LAN_HOST/CLIENT_IP=${lanHost} nu e IP-ul acestui PC (${localIps.join(', ') || 'necunoscut'}).`
          );
          lines.push('    Ruleaza Frontend pe PC-ul client sau actualizeaza dev-network.env.');
        }
        lines.push('');
        console.log(lines.join('\n'));
      });
    }
  };
}

function resolveApiBaseUrl() {
  if (process.env.VITE_API_BASE_URL?.trim()) {
    return process.env.VITE_API_BASE_URL.trim().replace(/\/$/, '');
  }
  const serverIp = networkEnv.SERVER_IP?.trim();
  if (serverIp) {
    return `${useHttps ? 'https' : 'http'}://${serverIp}:3000`;
  }
  return '';
}

const apiBaseFromNetwork = resolveApiBaseUrl();
const httpsOptions = useHttps ? loadHttpsOptions() : false;
const hmrHost = lanHost && getLocalIPv4Addresses().includes(lanHost) ? lanHost : getLocalIPv4Addresses()[0];
const hmrConfig =
  useHttps && hmrHost
    ? {
        host: hmrHost,
        port: 5173,
        protocol: 'wss'
      }
    : undefined;

export default defineConfig({
  plugins: [react(), printLanUrls()],
  define: apiBaseFromNetwork
    ? { 'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseFromNetwork) }
    : {},
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    https: httpsOptions,
    hmr: hmrConfig
  }
});
