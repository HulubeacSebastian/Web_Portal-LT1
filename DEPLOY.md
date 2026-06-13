# Portal LT1 — Deploy pe Oracle Cloud

Ghid pentru actualizarea aplicației în producție: **frontend** + **backend**, HTTPS cu Let's Encrypt, accesibil de oriunde pe internet.

## Infrastructură

| Rol | Hostname (DuckDNS) | IP public | SSH key (Windows) |
|-----|-------------------|-----------|-------------------|
| **Backend** (API, Node, pm2, Nginx) | [api-lt1.duckdns.org](https://api-lt1.duckdns.org) | `92.5.127.137` | `ssh-key-2026-05-26.key` |
| **Frontend** (site static, Nginx) | [portal-lt1.duckdns.org](https://portal-lt1.duckdns.org) | `130.61.121.152` | `ssh-key-2026-05-26_1.key` |

**Test rapid în browser**

- Frontend: https://portal-lt1.duckdns.org  
- Backend health: https://api-lt1.duckdns.org/health → `{"status":"ok"}`

---

## Conectare SSH

Rulează din **PowerShell pe Windows** (nu din interiorul unui SSH deja deschis).

### Backend (API)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26.key" ubuntu@92.5.127.137
```

### Frontend (site)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" ubuntu@130.61.121.152
```

---

## Update doar BACKEND

Codul API rulează pe VM-ul backend. Repo-ul trebuie clonat pe server (ex. `~/Web_Portal-LT1`).

### 1. Conectare + update cod

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26.key" ubuntu@92.5.127.137
```

Pe server:

```bash
cd ~/Web_Portal-LT1
git pull
# Nu rula `git restore` pe dev.db — sterge documentele si conturile adaugate pe server.

cd portal-lt1-backend
npm install
npx prisma migrate deploy
pm2 restart backend

pm2 status
curl http://127.0.0.1:3000/health
```

### 2. Verificare

În browser: **https://api-lt1.duckdns.org/health**

**Chat (WebSocket):** pe VM backend, Nginx trebuie headere `Upgrade`/`Connection` (vezi [deploy/nginx-api-with-websocket.conf](./deploy/nginx-api-with-websocket.conf)) și **MongoDB pornit**: `sudo systemctl enable --now mongod`.

### Variabile `.env` pe server (backend)

Fișier: `~/Web_Portal-LT1/portal-lt1-backend/.env`

Minim + **reset parolă prin email** (linkul din mail merge la site-ul public, nu la localhost):

```env
NODE_ENV=production
PORTAL_PRODUCTION=true
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
ALLOWED_ORIGINS=https://portal-lt1.duckdns.org
PORTAL_DEV_HTTP=true
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=portal_lt1_chat

PUBLIC_APP_URL=https://portal-lt1.duckdns.org
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=portal.lt1.suport@gmail.com
SMTP_PASS=PAROLA_APP_GMAIL
MAIL_FROM="Portal LT1 <portal.lt1.suport@gmail.com>"
MAIL_CONTACT_TO=portal.lt1.suport@gmail.com
AUTH_EXPOSE_DEV_CODES=false
```

Nu folosi `SSL_KEY_PATH` / `SSL_CERT_PATH` pe server — HTTPS face Nginx + Certbot.

După modificări `.env`: `pm2 restart backend`

Detalii: [ENV.md](./ENV.md) (secțiunea Email / deployment).

---

## Update doar FRONTEND

Build-ul se face pe **PC**; pe server se publică doar folderul `dist/`.

### 1. Build pe PC (PowerShell)

```powershell
cd C:\Users\Sebi\Desktop\portal-lt1\Web_Portal-LT1\portal-lt1-frontend
npm run build
```

URL API: `portal-lt1-frontend/.env.production` (în Git). Detalii: [ENV.md](./ENV.md).

Verificare opțională — nu trebuie să apară IP-ul vechi:

```powershell
Select-String -Path dist\assets\*.js -Pattern "api-lt1"
Select-String -Path dist\assets\*.js -Pattern "92.5.127"
```

### 2. Upload pe server

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" ubuntu@130.61.121.152 "rm -rf /tmp/portal-dist && mkdir -p /tmp/portal-dist"

scp -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" -r dist/* ubuntu@130.61.121.152:/tmp/portal-dist/
```

Folosește `dist/*` (nu `dist` singur) ca să nu creezi `/tmp/portal-dist/dist/` dublu.

### 3. Publicare pe site (SSH frontend)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" ubuntu@130.61.121.152
```

Pe server:

```bash
sudo rm -rf /var/www/portal/*
sudo cp -r /tmp/portal-dist/* /var/www/portal/
sudo chown -R www-data:www-data /var/www/portal
sudo chmod -R 755 /var/www/portal
```

### 4. Verificare

În browser: **https://portal-lt1.duckdns.org** → `Ctrl+Shift+R` sau fereastră Incognito.

### Build frontend

`portal-lt1-frontend/.env.production` (în Git):

```env
VITE_API_BASE_URL=
VITE_WS_BASE_URL=https://api-lt1.duckdns.org
```

Pe VM-ul **frontend**, Nginx trebuie să proxy-eze `/api` către backend (evită erori CORS la Activitate/Contact). Exemplu complet: [deploy/nginx-portal-with-api.conf](./deploy/nginx-portal-with-api.conf). După editare: `sudo nginx -t && sudo systemctl reload nginx`.

---

## Update COMPLET (backend + frontend)

### Pas 1 — Build frontend (PC)

```powershell
cd C:\Users\Sebi\Desktop\portal-lt1\Web_Portal-LT1\portal-lt1-frontend
npm run build
```

### Pas 2 — Upload frontend (PC)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" ubuntu@130.61.121.152 "rm -rf /tmp/portal-dist && mkdir -p /tmp/portal-dist"

scp -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" -r dist/* ubuntu@130.61.121.152:/tmp/portal-dist/
```

### Pas 3 — Update backend (SSH)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26.key" ubuntu@92.5.127.137
```

```bash
cd ~/Web_Portal-LT1
git pull
cd portal-lt1-backend
npm install
npx prisma migrate deploy
pm2 restart backend
exit
```

### Pas 4 — Publish frontend (SSH)

```powershell
ssh -i "C:\Users\Sebi\Desktop\ssh-key-2026-05-26_1.key" ubuntu@130.61.121.152
```

```bash
sudo rm -rf /var/www/portal/*
sudo cp -r /tmp/portal-dist/* /var/www/portal/
sudo chown -R www-data:www-data /var/www/portal
sudo chmod -R 755 /var/www/portal
exit
```

### Pas 5 — Test final

- https://api-lt1.duckdns.org/health  
- https://portal-lt1.duckdns.org → login  

---

## Debug rapid

### Backend

```bash
pm2 status
pm2 logs backend --lines 50
sudo nginx -t
sudo systemctl status nginx
curl http://127.0.0.1:3000/health
```

### Frontend

```bash
sudo ls -la /var/www/portal/assets/
sudo grep 'api-lt1' /var/www/portal/assets/index-*.js
curl -I https://portal-lt1.duckdns.org/
```

Dacă `grep` dă *Permission denied*, folosește `sudo` sau rulează `sudo chmod -R 755 /var/www/portal`.

---

## Probleme frecvente

| Simptom | Cauză probabilă | Soluție |
|---------|-----------------|---------|
| Timeout la API / site | Port 80/443 închis în Oracle (NSG + Security List) | Deschide TCP 22, 80, 443 pe VM-ul corect |
| Login: `http://92.5.127.137:3000` | Build vechi sau `dist` copiat greșit | Rebuild + `scp dist/*` + `cp` din `/tmp/portal-dist/` |
| `assets/` gol sau 403 | Permisiuni greșite | `chown www-data` + `chmod -R 755` |
| CORS la login | `ALLOWED_ORIGINS` greșit pe backend | `https://portal-lt1.duckdns.org` + `pm2 restart` |
| Contact: „succes” dar fără email | Lipsește `MAIL_CONTACT_TO` în `.env` pe backend | Adaugă `MAIL_CONTACT_TO=portal.lt1.suport@gmail.com` + `pm2 restart backend` |
| Chat: „Nu s-a putut conecta la wss://api-lt1…” | Nginx fără WebSocket upgrade sau MongoDB oprit | [nginx-api-with-websocket.conf](./deploy/nginx-api-with-websocket.conf) + `sudo systemctl start mongod` |
| „Nu se poate contacta serverul” pe Activitate | `dev-network*.env` pe server sau backend oprit | `NODE_ENV=production` în `.env`, redenumește `dev-network*.env` → `.bak`, `pm2 restart backend` |
| `nginx -t` failed: `portal` | Config frontend pe VM backend | Șterge symlink greșit; folosește `sites-available/api` |

---

## Cerințe examen (checklist)

- [ ] Frontend pe cloud — https://portal-lt1.duckdns.org  
- [ ] Backend pe cloud — https://api-lt1.duckdns.org  
- [ ] SSL Let's Encrypt (nu produse comerciale plătite)  
- [ ] Accesibil de oriunde pe internet  

---

## Fișiere `.env`

Ghid complet: **[ENV.md](./ENV.md)**

| Update | Strică `.env` de pe server? |
|--------|----------------------------|
| `npm run build` + `scp dist/*` | **Nu** |
| `git pull` pe server | **Nu** (`.env` backend nu e în Git) |
| `scp` manual `.env` PC → server | **Da** — nu face asta |

---

*Ultima actualizare: deploy Oracle Cloud + DuckDNS + Nginx + Certbot.*
