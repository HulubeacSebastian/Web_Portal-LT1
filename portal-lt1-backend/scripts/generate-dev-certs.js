const fs = require('fs');
const os = require('os');
const path = require('path');
const selfsigned = require('selfsigned');

const certsDir = path.join(__dirname, '..', 'certs');

function getLocalIPv4Addresses() {
  const addresses = new Set(['127.0.0.1']);

  for (const iface of Object.values(os.networkInterfaces())) {
    for (const entry of iface || []) {
      if (entry.family === 'IPv4' && !entry.internal) {
        addresses.add(entry.address);
      }
    }
  }

  for (const ip of (process.env.EXTRA_DEV_IPS || '').split(',')) {
    const trimmed = ip.trim();
    if (trimmed) addresses.add(trimmed);
  }

  return Array.from(addresses);
}

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

const ipAddresses = getLocalIPv4Addresses();
const altNames = [
  { type: 2, value: 'localhost' },
  ...ipAddresses.map((ip) => ({ type: 7, ip }))
];

const attrs = [{ name: 'commonName', value: 'portal-lt1-dev' }];
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256',
  extensions: [{ name: 'subjectAltName', altNames }]
});

fs.writeFileSync(path.join(certsDir, 'dev.key'), pems.private);
fs.writeFileSync(path.join(certsDir, 'dev.crt'), pems.cert);

console.log('Certificate TLS generate in portal-lt1-backend/certs/');
console.log('Adrese incluse in certificat:', ['localhost', ...ipAddresses].join(', '));
