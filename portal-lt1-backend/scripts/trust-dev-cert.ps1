# Ruleaza ca Administrator o singura data — instaleaza dev.crt in Trusted Root (Windows)
$ErrorActionPreference = 'Stop'
$certPath = Join-Path $PSScriptRoot '..\certs\dev.crt'
if (-not (Test-Path $certPath)) {
  Write-Host 'Lipseste dev.crt. Ruleaza: npm run prepare:dev-tls'
  exit 1
}
Import-Certificate -FilePath $certPath -CertStoreLocation Cert:\LocalMachine\Root
Write-Host "Certificat instalat: $certPath"
Write-Host 'Reporneste Chrome complet.'
