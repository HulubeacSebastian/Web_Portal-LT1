# Rezumat — Assignment 3 (Bronze)

**Proiect:** Portal LT1 — management documente  
**Student:** Sebi  
**Cerință:** persistență pe server, ORM, bază relațională, CRUD, statistici/filtre, migrări, teste, client și server pe mașini diferite.

---

## Ce aveam la început

Până la Assignment 3, aplicația ținea datele **în memorie** (array-uri în `documentStore.js` și `extraStores.js`). La repornirea serverului totul se pierdea. Login-ul din frontend era **simulat** (doar cookie în browser), fără request real la API.

---

## Ce am făcut (pe scurt)

### 1. Bază de date + ORM (Prisma)

Am ales **Prisma** cu **SQLite** pentru că se potrivește cu backend-ul Node/Express pe care îl aveam deja.

- Schema: `portal-lt1-backend/prisma/schema.prisma`
- Migrări generate automat (nu am scris `CREATE TABLE` manual): `prisma/migrations/`
- Seed cu date inițiale: `prisma/seed.js` (documente, utilizatori, postări)

Comenzi pe care le folosesc:

```bash
cd portal-lt1-backend
npm run db:migrate
npm run db:seed
```

### 2. Schema în 3NF

Am separat valorile repetate în tabele de lookup, ca să nu am redundanță:

| Tabel | Rol |
|-------|-----|
| `Role` | admin / teacher pentru `User` |
| `DocumentStatus` | Activ, Revizie, Arhivat |
| `DocumentCategory` | Regulament, Procedură, etc. |
| `PostCategory` | categorii pentru postări |
| `User`, `Document`, `Post`, `ContactMessage` | entitățile principale |

Relații importante: `Post.author_id` → `User`, `Document` → categorie + status prin chei străine.

### 3. CRUD + statistici + filtre

Store-urile din memorie au fost înlocuite cu interogări Prisma. API-ul existent a rămas același:

- **Documente:** `GET/POST/PUT/DELETE /api/documents` (+ upload PDF)
- **Postări:** CRUD pe `/api/posts`
- **Contact:** `POST /api/contact`
- **Auth:** `POST /api/auth/login`
- **Statistici:** `GET /api/statistics/documents` (total, pe status, pe categorie)
- **Filtre listă documente:** `?query=...` și `?status=...` + paginare

Rutele sunt **async** (Prisma e asincron).

### 4. Login real + WebSocket

- Pagina de login apelează acum `POST /api/auth/login` și salvează token-ul JWT în `localStorage`.
- WebSocket-ul pentru generatorul de documente folosește IP-ul din `VITE_API_BASE_URL`, nu mai e blocat pe `localhost`.

### 5. Teste

Am rulat testele backend pe baza de date de test (`prisma/test.db`):

```bash
npm run test:backend
```

Toate testele trec (inclusiv CRUD, auth, postări, contact, statistici, generator).

### 6. Rulare pe două PC-uri (NOT localhost)

Am testat cu:

- **PC server (Windows):** backend pe port 3000, IP ex. `192.168.0.81`
- **PC client (Mac):** frontend Vite pe port 5173, IP ex. `192.168.0.94`

#### Fișiere `.env` (nu merg pe Git — fiecare PC are al lui)

**Pe SERVER** (`portal-lt1-backend/.env`):

```env
ALLOWED_ORIGINS=http://IP_CLIENT:5173
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
```

→ aici pun IP-ul **clientului** (mașina cu browserul).

**Pe CLIENT** (`portal-lt1-frontend/.env`):

```env
VITE_API_BASE_URL=http://IP_SERVER:3000
```

→ aici pun IP-ul **serverului** (mașina cu backend-ul).

Exemple în repo: `portal-lt1-backend/.env.example` și `portal-lt1-frontend/.env.example`.

#### Frontend accesibil din rețea

Am modificat scriptul `dev` în `portal-lt1-frontend/package.json`:

```json
"dev": "vite --host 0.0.0.0 --port 5173"
```

Butonul **Frontend (Vite)** din JetBrains pornește direct cu aceste setări.

---

## Structură fișiere noi / importante

```
portal-lt1-backend/
  prisma/
    schema.prisma          # model ORM + 3NF
    seed.js                # date inițiale
    migrations/            # migrări generate
  src/db/
    prisma.js              # client Prisma
    reset.js               # reset DB pentru teste
    mappers.js             # mapare DB → JSON API
  .env.example             # șablon SERVER

portal-lt1-frontend/
  .env.example             # șablon CLIENT
```

---

## Cum rulez proiectul

### Local (un singur PC)

```bash
npm run install:all
cd portal-lt1-backend
npm run db:migrate
npm run db:seed
npm start
```

În alt terminal / Run config: **Frontend (Vite)** sau `npm run dev` din `portal-lt1-frontend`.

### Două PC-uri

1. Server: `npm start` în backend + `.env` cu `ALLOWED_ORIGINS` = IP client
2. Client: `npm run dev` în frontend + `.env` cu `VITE_API_BASE_URL` = IP server
3. Browser pe client: `http://IP_CLIENT:5173`
4. Login test: `admin@lt1.ro` / `admin123`
5. Pe terminalul serverului ar trebui să apară `POST /api/auth/login 200`

---

## Probleme întâlnite și rezolvări

| Problemă | Cauză | Rezolvare |
|----------|--------|-----------|
| Nimic în terminal la login | Login era simulat / request pe localhost greșit | Login real + `.env` cu IP server pe client |
| `GET /api/auth/login 404` | Deschisesem URL-ul API în browser (GET) | Login doar din app, metoda **POST** |
| `Missing script: "dev"` | `npm run dev` din rădăcină | `cd portal-lt1-frontend` sau Run **Frontend (Vite)** |
| Eroare `AuthPageLayout` pe Mac | Fișier lipsă după copiere incompletă | `git pull` / copiere `components/` |
| `.env` nu merge pe Git | Conține IP-uri locale, practică standard | Doar `.env.example` în repo |

---

## Ce pot demonstra la predare

1. Migrări Prisma în `prisma/migrations/`
2. Schema 3NF în `schema.prisma`
3. CRUD funcțional din UI + date persistate după restart server
4. `GET /api/statistics/documents` cu agregări
5. `npm run test:backend` — toate testele verzi
6. Screenshot: UI pe IP client + request către IP server (F12 Network) + log `POST /api/auth/login 200` pe server

---

## Concluzie

Am trecut de la stocare în memorie la o **bază relațională** gestionată cu **Prisma**, cu **migrări**, **CRUD complet**, **statistici și filtre**, teste automate și demonstrație pe **două calculatoare** din aceeași rețea, conform cerințelor Bronze pentru Assignment 3.
