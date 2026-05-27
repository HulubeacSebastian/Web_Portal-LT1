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

Fișier pe VM-ul **backend** (`api-lt1`): `~/Web_Portal-LT1/portal-lt1-backend/.env`

**Nu copia `.env` de pe PC.** Pe server pui variabilele de mai jos (inclusiv email).

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=3000
ALLOWED_ORIGINS=https://portal-lt1.duckdns.org
PORTAL_DEV_HTTP=true
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=portal_lt1_chat

# Linkul din mail trebuie să ducă la SITE (frontend), nu la localhost
PUBLIC_APP_URL=https://portal-lt1.duckdns.org

# Gmail (cont dedicat + App Password din Google)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=portal.lt1.suport@gmail.com
SMTP_PASS=PAROLA_APP_16_CARACTERE_FARA_SPATII
MAIL_FROM="Portal LT1 <portal.lt1.suport@gmail.com>"

# Producție: nu mai afișa token în UI
AUTH_EXPOSE_DEV_CODES=false
```

Fără `SSL_KEY_PATH` / `SSL_CERT_PATH`. După salvare: `pm2 restart backend`.

## Email — resetare parolă (deployment)

| Unde | Ce face |
|------|---------|
| **PC local** | `.env` cu `PUBLIC_APP_URL=http://localhost:5173` → linkurile din mail merg doar dacă rulezi `npm run dev` |
| **Server (deploy)** | `.env` cu `PUBLIC_APP_URL=https://portal-lt1.duckdns.org` → linkurile din mail deschid site-ul live |

Flux:

1. Utilizatorul pe **https://portal-lt1.duckdns.org** → „Ai uitat parola?”
2. Backend pe **https://api-lt1.duckdns.org** trimite mailul (SMTP)
3. Linkul din mail: `https://portal-lt1.duckdns.org/reset-password?resetToken=...&token=...`

**Mailurile vechi** (trimise când lipsea `PUBLIC_APP_URL`) au încă `localhost` în link — cere din nou resetarea după ce ai configurat serverul.

Butonul **Trimite link de resetare** apelează `POST /api/auth/forgot-password`. Fără SMTP, tokenul poate apărea în UI doar dacă `AUTH_EXPOSE_DEV_CODES=true`.

Alternativ la Gmail: Brevo, SendGrid, Mailgun — aceleași variabile `SMTP_*` și `MAIL_FROM`.

## Rezumat

| Acțiune | Strică serverul? |
|---------|------------------|
| Modifici `.env` pe PC | Nu |
| `npm run build` + upload `dist` | Nu |
| `git pull` pe server | Nu (pentru `.env` backend) |
| `scp` manual `.env` PC → server | Da — evită |

Deploy complet: [DEPLOY.md](./DEPLOY.md).
