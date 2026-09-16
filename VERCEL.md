# Deploy pe Vercel (frontend + backend)

Acest ghid descrie migrarea de la Oracle Cloud (vezi [DEPLOY.md](DEPLOY.md)) la Vercel.
Sunt **2 proiecte Vercel separate** din același repo Git (monorepo): unul pentru
`portal-lt1-frontend`, unul pentru `portal-lt1-backend`.

## Ce s-a schimbat deja în cod (gata făcut)

- `portal-lt1-backend/src/db/prisma.js` — Prisma folosește acum adaptorul **libSQL**
  (`@prisma/adapter-libsql`), compatibil atât cu fișierul local SQLite (dev), cât și cu
  **Turso** (producție pe Vercel). Nimic nu se schimbă pentru dev local.
- `portal-lt1-backend/api/index.js` — punctul de intrare serverless (Vercel apelează
  direct exportul Express).
- `portal-lt1-backend/vercel.json` — toate rutele sunt redirecționate către funcția
  serverless; `uploads/**` e inclus explicit în bundle ca documentele deja urcate să
  rămână accesibile.
- `portal-lt1-frontend/vercel.json` — proxy pentru `/api/*` către backend-ul Vercel
  (**trebuie editat manual** cu URL-ul real, vezi Pasul 3).
- **Chat-ul (WebSocket) și uploadul de documente sunt dezactivate automat pe Vercel**
  (returnează HTTP 503 cu un mesaj clar) — Vercel setează singur variabila `VERCEL=1`,
  iar codul o verifică în `src/routes/chat.js` și `src/routes/documents.js`. Pe Oracle
  Cloud / local, nimic nu se schimbă, ambele funcționează normal.
- Am consolidat local cele două fișiere `dev.db` găsite (unul gol, unul cu date reale)
  în `prisma/dev.db` — necesar pentru ca adaptorul libSQL să găsească datele corecte
  (rezolvă căile relative diferit față de motorul Prisma vechi).

## De ce chat-ul și uploadul sunt oprite temporar

- **Chat**: ține o conexiune WebSocket persistentă + MongoDB local — funcțiile
  serverless de pe Vercel nu pot ține conexiuni persistente și nu ajung la MongoDB-ul
  de pe VM-ul vechi.
- **Upload documente**: scrie fișiere pe disc — discul funcțiilor serverless e efemer
  (nu ține fișiere între request-uri).

Ambele pot fi reactivate mai târziu (MongoDB Atlas + Pusher/Ably pentru chat, Vercel
Blob Storage pentru upload) — sunt schimbări separate, nu blochează restul site-ului.

---

## Pas 1 — Creează baza de date Turso

Turso e compatibil SQLite, deci schema Prisma rămâne neschimbată.

```powershell
# instalare CLI (o singura data)
irm get.tur.so/install.ps1 | iex

turso auth login
turso db create portal-lt1
turso db show portal-lt1 --url
turso db tokens create portal-lt1
```

Notează cele două valori — le pui în variabilele de mediu de la Pasul 2:
- URL-ul (arată ca `libsql://portal-lt1-xxxxx.turso.io`) → `DATABASE_URL`
- Token-ul → `TURSO_AUTH_TOKEN`

### Aplică schema pe Turso

```powershell
cd portal-lt1-backend
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql
turso db shell portal-lt1 < schema.sql
```

Rulează asta **o singură dată**, pe o bază de date Turso goală (schema completă dintr-o
mișcare). Pentru schimbări viitoare de schemă, generează diff-ul din nou și aplică-l
la fel — `prisma migrate deploy` nu funcționează direct pe un URL `libsql://` remote.

---

## Pas 2 — Deploy BACKEND pe Vercel

„New Project" → importă `HulubeacSebastian/Web_Portal-LT1` din nou (da, un al doilea
proiect din același repo):

| Câmp | Valoare |
|---|---|
| Project Name | `web-portal-lt1-api` (sau orice nume) |
| Root Directory | `portal-lt1-backend` |
| Framework Preset | **Other** |
| Build Command | (lasă gol / default — `postinstall` rulează `prisma generate` automat) |
| Output Directory | (lasă gol) |

**Environment Variables** (Settings → Environment Variables, pentru Production):

```
DATABASE_URL=libsql://portal-lt1-xxxxx.turso.io
TURSO_AUTH_TOKEN=<token-ul de la turso db tokens create>
JWT_SECRET=<un string lung, generat aleator — NU folosi valoarea din .env.example>
NODE_ENV=production
ALLOWED_ORIGINS=https://<domeniul-frontend-ului-vercel>
PUBLIC_APP_URL=https://<domeniul-frontend-ului-vercel>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=portal.lt1.suport@gmail.com
SMTP_PASS=<parola de aplicatie Gmail>
MAIL_FROM=Portal LT1 <portal.lt1.suport@gmail.com>
MAIL_CONTACT_TO=portal.lt1.suport@gmail.com
AUTH_EXPOSE_DEV_CODES=false
```

Apasă **Deploy**. La final, notează URL-ul generat (ex.
`https://web-portal-lt1-api.vercel.app`) — îl folosești la Pasul 3.

Verifică: `https://web-portal-lt1-api.vercel.app/health` → `{"status":"ok"}`.

---

## Pas 3 — Deploy FRONTEND pe Vercel

Înainte de deploy, editează `portal-lt1-frontend/vercel.json` și înlocuiește
`INLOCUIESTE-CU-URL-BACKEND-VERCEL` cu URL-ul real de la Pasul 2, apoi `git commit` +
`push`.

Ecranul din poza ta ("New Project") — completează:

| Câmp | Valoare |
|---|---|
| Project Name | `web-portal-lt1` |
| Root Directory | `portal-lt1-frontend` |
| Framework Preset | **Vite** (ar trebui detectat automat) |

**Environment Variables** — copiază conținutul din
`portal-lt1-frontend/.env.production` (deja există în Git, îl vezi și pe GitHub):

```
VITE_API_BASE_URL=
VITE_FILES_BASE_URL=https://<domeniul-backend-ului-vercel>
VITE_WS_BASE_URL=
```

Apasă **Deploy**.

---

## Pas 4 — Verificare finală

- Frontend: `https://web-portal-lt1.vercel.app` → login funcționează
- Backend health: `https://web-portal-lt1-api.vercel.app/health`
- Documente: se văd în listă (citire OK); încărcarea unui document nou dă eroare 503
  clară — e așteptat, vezi secțiunea de mai sus
- Chat: pagina se încarcă, dar conexiunea dă eroare — la fel, e așteptat

---

## De renunțat la Oracle Cloud

După ce confirmi că Vercel funcționează identic, poți opri/șterge VM-urile din Oracle
Cloud Console (asta se face din contul tău Oracle, nu am acces eu acolo). Nu uita să
păstrezi o copie a `.env`-ului de pe VM-ul backend (are `SMTP_PASS` și alte secrete) în
caz că vrei să revii vreodată la acel flux.
