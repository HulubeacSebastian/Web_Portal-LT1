# Assignment 3 — Persistență server (Bronze)

## Cerințe acoperite

| Cerință | Implementare |
|--------|----------------|
| ORM compatibil cu backend Node/Express | **Prisma** |
| Bază relațională | **SQLite** (dev/test); poți folosi PostgreSQL în producție schimbând `DATABASE_URL` |
| Toate entitățile din domeniu | `User`, `Post`, `PostCategory`, `Document`, `DocumentCategory`, `DocumentStatus`, `ContactMessage` |
| CRUD | API existent (`/api/documents`, `/api/posts`, `/api/contact`, auth/users) |
| Statistici și filtre | `GET /api/statistics/documents`, filtre `query` + `status` pe listă documente |
| Schema 3NF | Tabele de lookup pentru rol, status document, categorii post/document |
| Migrări din obiecte (nu SQL manual) | `prisma migrate` din `prisma/schema.prisma` |
| Teste | `portal-lt1-Tests/backend/documents.api.test.js` + Jest pe DB de test |
| Client pe altă mașină decât serverul | Vezi secțiunea **Deploy VM** |

## Schema 3NF (rezumat)

- **Role** — elimină redundanța rolului pe `User`
- **DocumentStatus** — statusul nu se repetă ca text liber pe fiecare rând
- **DocumentCategory** / **PostCategory** — categorii normalizate
- **User** → **Post** (FK `author_id`)
- **Document** → categorie + status prin FK

## Comenzi locale

```bash
cd portal-lt1-backend
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm start
```

Teste backend:

```bash
npm run test:backend
```

## Deploy VM (obligatoriu la predare — NOT localhost)

### VM 1 — Server (backend)

1. Instalează Node.js 18+.
2. Clonează repo-ul, rulează migrări + seed (comenzile de mai sus).
3. Pornește backend-ul ascultând pe toate interfețele (deja configurat în `bin/www`):

```bash
set PORT=3000
set ALLOWED_ORIGINS=http://IP_VM2:5173
npm start
```

4. Notează IP-ul VM1 (ex. `192.168.56.10`). Verifică: `http://192.168.56.10:3000/health`

### VM 2 — Client (frontend)

1. Instalează Node.js 18+.
2. Creează `portal-lt1-frontend/.env`:

```
VITE_API_BASE_URL=http://IP_VM1:3000
```

3. Pornește frontend-ul accesibil din rețea:

```bash
cd portal-lt1-frontend
npm install
npm run dev
```

4. Deschide în browser pe VM2: `http://IP_VM2:5173` (sau de pe alt PC din rețea).

**Important:** browserul care rulează UI-ul nu trebuie să folosească `localhost` pentru API — `VITE_API_BASE_URL` trebuie să pointeze la IP-ul VM1.

### Demonstrație pentru profesor

- Screenshot: `health` pe IP server
- Screenshot: UI deschis de pe IP client (nu `localhost`)
- Output: `npm run test:backend` trecut
