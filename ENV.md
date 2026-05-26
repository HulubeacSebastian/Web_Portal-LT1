# Configurare mediu — PC vs server

Două medii separate. **Nu copia `.env` de pe PC pe server** (și invers).

## Structură fișiere

| Fișier | Git | Unde | Când |
|--------|-----|------|------|
| `portal-lt1-backend/.env` | Nu | PC + server (copii diferite) | Backend rulează |
| `portal-lt1-backend/.env.example` | Da | Șablon | `copy .env.example .env` |
| `portal-lt1-frontend/.env.production` | Da | Build deploy | `npm run build` |
| `portal-lt1-frontend/.env.development` | Da | Dev local | `npm run dev` / Run IntelliJ |
| `portal-lt1-frontend/.env` | Nu (gol) | — | Folosește fișierele de mai sus |
| `dev-network.local.env` | Nu | PC offline | Proxy → localhost:3000 |
| `dev-network.env` | Da | PC → API cloud | Backend pe Oracle din local |

## PC — prima configurare

```powershell
cd portal-lt1-backend
copy .env.example .env

cd ..
copy dev-network.local.env.example dev-network.local.env
```

Backend local: `.env` cu `localhost` + cert dev (deja în `.env.example`).

Frontend local: `.env.development` + `dev-network.local.env` → Run **`dev (local offline)`**.

## PC — deploy frontend (nu atinge `.env` de pe server)

```powershell
cd portal-lt1-frontend
npm run build
```

URL API vine din **`.env.production`** (`https://api-lt1.duckdns.org`), nu din `.env` de pe PC.

Apoi `scp dist/*` — vezi [DEPLOY.md](./DEPLOY.md).

## PC — update backend pe server

```bash
cd ~/Web_Portal-LT1
git pull
cd portal-lt1-backend
npm install
npx prisma migrate deploy
pm2 restart backend
```

`git pull` **nu** înlocuiește `portal-lt1-backend/.env` de pe server (fișierul nu e în Git).

## Server backend — `.env` (doar SSH)

`~/Web_Portal-LT1/portal-lt1-backend/.env`:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
ALLOWED_ORIGINS=https://portal-lt1.duckdns.org
PORTAL_DEV_HTTP=true
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=portal_lt1_chat
AUTH_EXPOSE_DEV_CODES=true
```

Fără `SSL_KEY_PATH` / `SSL_CERT_PATH`.

## Rezumat

| Acțiune | Strică serverul? |
|---------|------------------|
| Modifici `.env` pe PC | Nu |
| `npm run build` + upload `dist` | Nu |
| `git pull` pe server | Nu (pentru `.env` backend) |
| `scp` manual `.env` PC → server | Da — evită |

Deploy complet: [DEPLOY.md](./DEPLOY.md).
