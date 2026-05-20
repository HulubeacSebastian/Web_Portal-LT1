const fs = require('fs');
const path = require('path');
const selfsigned = require('selfsigned');

const certsDir = path.join(__dirname, '..', 'certs');

if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

const attrs = [{ name: 'commonName', value: 'portal-lt1-dev' }];
const pems = selfsigned.generate(attrs, {
  days: 365,
  keySize: 2048,
  algorithm: 'sha256'
});

fs.writeFileSync(path.join(certsDir, 'dev.key'), pems.private);
fs.writeFileSync(path.join(certsDir, 'dev.crt'), pems.cert);

console.log('Certificatele de dezvoltare au fost generate in portal-lt1-backend/certs/');
