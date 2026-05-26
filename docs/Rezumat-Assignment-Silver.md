# Rezumat — Assignment Silver

**Proiect:** Portal LT1  
**Nivel:** Silver Challenge

---

## Cerințe Silver și ce am implementat

### 1. USER, ROLES, PERMISSIONS (bază relațională / Prisma)

Am extins schema Prisma cu:

- `Permission` — acțiuni atomice (`documents:create`, `chat:use`, etc.)
- `RolePermission` — legătură many-to-many între rol și permisiuni
- `Role` — `admin` (permisiuni complete) și `user` (permisiuni restrânse)

Seed-ul din `prisma/seed.js` populează automat permisiunile pentru fiecare rol.

API pentru verificare la predare: `GET /api/roles` — returnează matricea rol → permisiuni.

### 2. Login cu comportament diferit (admin vs user)

| Rol | Cont test | Permisiuni |
|-----|-----------|------------|
| **admin** | `admin@lt1.ro` / `admin123` | toate (CRUD documente, postări, generator, chat) |
| **user** | `profesor@lt1.ro` / `profesor123` | doar `documents:read` + `chat:use` |

La login, token-ul JWT include lista de permisiuni. Middleware-ul `requirePermission()` blochează acțiunile nepermise cu **403**.

Exemple:

- user **nu** poate `POST /api/documents`
- admin **poate** crea/edita/șterge documente

Frontend-ul ascunde butoanele (Adăugare, Editează, Șterge, Generator) dacă lipsește permisiunea.

### 3. Chat în timp real (NoSQL + WebSocket)

- **NoSQL:** MongoDB — colecția `messages` în baza `portal_lt1_chat`
- **WebSocket:** același server ca backend-ul (port 3000)
- **Persistență:** fiecare mesaj e salvat în MongoDB, apoi broadcast la toți clienții

Protocol WebSocket:

1. `chat_join` + token JWT
2. server trimite `chat_history`
3. `chat_message` → salvare MongoDB + `chat_message` broadcast

Pagină UI: `/chat` (vizibilă după login dacă ai `chat:use`).

### 4. Configurare MongoDB

În `portal-lt1-backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=portal_lt1_chat
```

Trebuie să ai **MongoDB pornit** pe PC-ul server (sau Docker).

---

## Demonstrație pentru 2 utilizatori (predare)

1. **PC server:** backend + MongoDB + `npm start`
2. **PC client 1:** login `admin@lt1.ro` → `/chat`
3. **PC client 2** (sau alt browser/incognito): login `profesor@lt1.ro` → `/chat`
4. Trimite mesaje din ambele — apar în timp real pe ambele ecrane
5. Arată `GET /api/roles` și un `POST /api/documents` cu user → **403**

---

## Teste

```bash
npm run test:backend
```

Fișiere noi:

- `portal-lt1-Tests/backend/silver.permissions.test.js`
- `portal-lt1-Tests/backend/silver.chat.test.js`

MongoDB în teste folosește `mongodb-memory-server` (nu trebuie instalat MongoDB pentru Jest).

---

## Fișiere importante

```
portal-lt1-backend/src/permissions/catalog.js
portal-lt1-backend/src/middleware/permissions.js
portal-lt1-backend/src/chat/mongoClient.js
portal-lt1-backend/src/chat/chatStore.js
portal-lt1-backend/src/chat/wsChat.js
portal-lt1-frontend/src/pages/ChatPage.jsx
portal-lt1-frontend/src/utils/authSession.js
```

---

## Comenzi după pull

```bash
cd portal-lt1-backend
npm install
npx prisma migrate dev
npm run db:seed
# porneste MongoDB, apoi:
npm start
```

```bash
cd portal-lt1-frontend
npm run dev
```
