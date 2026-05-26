# Pornire rapidă (development)

## Zilnic — fără certificat (recomandat)

**Terminal 1 — backend:**
```powershell
cd portal-lt1-backend
npm run start:dev
```

**Terminal 2 — frontend:**
```powershell
cd portal-lt1-frontend
npm run dev
```

**Browser:** `http://192.168.0.81:5173` (înlocuiește cu IP-ul tău)

Nu deschide `:3000` în browser — acolo e doar API-ul.

---

## Predare Assignment 4 — cu HTTPS

```powershell
cd portal-lt1-backend
npm start
```

```powershell
cd portal-lt1-frontend
npm run preview:https
```

Deschide `https://192.168.0.81:5173` → acceptă certificatul o dată.

Sau instalează certificatul permanent (PowerShell **Administrator**):
```powershell
npm run trust:dev-cert
```

---

## Dacă portul e ocupat

```powershell
Get-NetTCPConnection -LocalPort 3000,5173 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
```
