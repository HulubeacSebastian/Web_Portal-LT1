import os from 'node:os';

export function getLocalIPv4Addresses() {
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

/** Masina cu browser/Vite, backend pe alt PC (Assignment 4). */
export function isClientMachine(networkEnv, localIps = getLocalIPv4Addresses()) {
  const serverIp = networkEnv.SERVER_IP?.trim();
  const clientIp = networkEnv.CLIENT_IP?.trim();
  const lanHost = networkEnv.VITE_LAN_HOST?.trim();

  if (
    serverIp &&
    serverIp !== '127.0.0.1' &&
    serverIp !== 'localhost' &&
    !localIps.includes(serverIp)
  ) {
    return true;
  }
  if (clientIp && localIps.includes(clientIp)) {
    return true;
  }
  if (lanHost && localIps.includes(lanHost)) {
    return true;
  }
  return false;
}

export function validateClientNetworkEnv(networkEnv, localIps = getLocalIPv4Addresses()) {
  if (!isClientMachine(networkEnv, localIps)) {
    return null;
  }
  const serverIp = networkEnv.SERVER_IP?.trim();
  if (!serverIp) {
    return (
      'Pe CLIENT (Mac): lipseste SERVER_IP in dev-network.env.\n' +
      '  Adauga: SERVER_IP=192.168.0.81  (IP-ul PC-ului cu backend, nu 127.0.0.1).'
    );
  }
  if (serverIp === '127.0.0.1' || serverIp === 'localhost') {
    return (
      'SERVER_IP=127.0.0.1 este gresit pe Mac.\n' +
      '  Backend-ul e pe PC: SERVER_IP=192.168.0.81 (ipconfig pe Windows).'
    );
  }
  return null;
}
