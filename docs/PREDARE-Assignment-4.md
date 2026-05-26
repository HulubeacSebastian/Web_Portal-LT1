# Predare Assignment 4 — conform cerintei (Bronze + Silver)

**Cerinta obligatorie:** server pe **o masina**, client (browser + frontend) pe **alta masina**, aceeasi **LAN**, tot traficul relevant **HTTPS**.

Nu se accepta pentru demonstratie:
- doar `localhost` pe acelasi PC pentru cerinta „masini diferite”
- `http://` (fara criptare)
- API pe Vercel / internet — serverul trebuie in LAN

---

## Roluri retea (exemplu)

| Rol | Masina | IP exemplu |
|-----|--------|------------|
| **SERVER** | PC Windows | `192.168.0.81` |
| **CLIENT** | Mac (browser) | `192.168.0.94` |

Inlocuieste cu IP-urile tale reale (`ipconfig` / `ipconfig getifaddr en0`).

---

## Pas 0 — `dev-network.env` (ambele repo-uri, aceeasi copie)

In radacina proiectului (`dev-network.env`):

```env
CLIENT_IP=192.168.0.94
SERVER_IP=192.168.0.81
EXTRA_DEV_IPS=192.168.0.94,192.168.0.81
VITE_LAN_HOST=192.168.0.94

VITE_USE_DEV_PROXY=false
BACKEND_HTTP=false
VITE_DISABLE_HMR=true
```

`VITE_USE_DEV_PROXY=false` = browserul de pe CLIENT apeleaza direct `https://SERVER:3000` (cerinta HTTPS pe retea).

---

## Pas 1 — Certificate TLS (pe SERVER, o data)

```powershell
cd portal-lt1-backend
npm run prepare:dev-tls
```

Copiaza folderul `portal-lt1-backend/certs/` si pe CLIENT (acelasi continut).

Pe **ambele** masini, instaleaza certificatul in trust store (o data):
- Windows (Administrator): `npm run trust:dev-cert` din radacina repo
- Mac: dublu-click `dev.crt` → Keychain → Always Trust

---

## Pas 2 — SERVER (PC backend)

Fisier `portal-lt1-backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
SSL_KEY_PATH=certs/dev.key
SSL_CERT_PATH=certs/dev.crt
ALLOWED_ORIGINS=https://192.168.0.94:5173
AUTH_EXPOSE_DEV_CODES=true
```

Pornire:

```powershell
cd portal-lt1-backend
npm run db:migrate
npm run db:seed
npm start
```

Verificare pe SERVER: `https://127.0.0.1:3000/health` → `{"status":"ok"}`

---

## Pas 3 — CLIENT (Mac frontend)

Fisier `portal-lt1-frontend/.env`:

```env
VITE_API_BASE_URL=https://192.168.0.81:3000
```

Pornire:

```bash
cd portal-lt1-frontend
npm install
npm run dev:https
```

Deschide pe **Mac**: `https://<IP-mac>:5173` (nu IP-ul PC-ului)

**Prima data pe Mac (obligatoriu):**
1. `https://192.168.0.81:3000/health` → Advanced → Proceed (certificat server)
2. Apoi `https://<IP-mac>:5173` → accepta certificat frontend daca e nevoie

---

## Daca merge pe PC dar NU pe Mac

### 1. IP Mac real (adesea nu e .94)

Pe Mac in Terminal:
```bash
ipconfig getifaddr en0
```

Actualizeaza `CLIENT_IP` si `VITE_LAN_HOST` in `dev-network.env` (pe **ambele** masini, acelasi fisier), apoi:
```powershell
npm run prepare:dev-tls
```
Repornește backend + frontend.

### 2. Firewall Windows (cauza #1)

Pe **PC server**, PowerShell **Administrator**:
```powershell
New-NetFirewallRule -DisplayName "Portal LT1 API 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -Profile Private
```

### 3. Fisiere pe Mac (repo complet)

Pe Mac trebuie:
- `dev-network.env` (radacina)
- `portal-lt1-backend/certs/` (copiat de pe PC)
- `portal-lt1-frontend/.env` cu `VITE_API_BASE_URL=https://192.168.0.81:3000`

### 4. Test din Terminal Mac

```bash
curl -k https://192.168.0.81:3000/health
```
Trebuie `{"status":"ok"}`. Daca nu merge, problema e retea/firewall, nu React.

### 5. F12 pe Mac la login

Trebuie `https://192.168.0.81:3000/api/auth/login` — daca `(failed)`, revino la pasii 1–2.

---

## Ce demonstrezi la lab (Bronze)

1. **Doua masini:** UI pe IP CLIENT (`:5173`), API pe IP SERVER (`:3000`) — F12 → Network → `https://192.168.0.81:3000/api/...`
2. **HTTPS:** URL-uri incep cu `https://`
3. **Login securizat:** parola → OTP (6 cifre) → sesiune (token + refresh in Local Storage)
4. **Token + permisiuni:** `admin@lt1.ro` vs `profesor@lt1.ro` — comportament diferit
5. **Inactivitate:** asteapta ~30 min sau seteaza `VITE_SESSION_IDLE_MS=60000` pentru test rapid
6. **Teste:** `npm run test:backend` pe SERVER

Conturi: `admin@lt1.ro` / `admin123`, `profesor@lt1.ro` / `profesor123`

---

## Silver (deja in proiect)

- Autentificare 3 pasi: `POST /login` → `POST /verify-otp` → token sesiune
- Recuperare parola: `/forgot-password` → `/reset-password`
- Roluri + permisiuni in JWT; sesiuni in `UserSession`

---

## Greșeli frecvente

| Gresit | Corect |
|--------|--------|
| `https://0.0.0.0:3000` | `https://192.168.0.81:3000` |
| `http://...:5173` | `https://...:5173` |
| Acelasi PC doar localhost la predare | Mac + PC pe LAN |
| `npm run start:dev` (HTTP) la predare | `npm start` (HTTPS) |
| Proxy fara HTTPS end-to-end | `VITE_USE_DEV_PROXY=false` + `VITE_API_BASE_URL` spre SERVER |
