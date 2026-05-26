# 📄 Document Management Portal

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Node](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![License](https://img.shields.io/badge/License-MIT-informational)

A React-based document management portal for Liceul Tehnologic Nr. 1. It demonstrates **master–detail UI**, **full CRUD**, **client-side validation**, and **server-side persistence** with Prisma ORM (Assignment 3).

## ✨ What you can do

- 📚 **Browse documents** in a paginated table (master view)
- 🔎 **Open a document** to see full details (detail view)
- ✍️ **Create, edit, and delete** documents (CRUD)
- ✅ **Validate forms** on the client for Create/Edit flows
- 🗄️ **Persist data** in a relational SQLite database via Prisma migrations

## 🧰 Tech stack

- **React**
- **React Router** (routes like `/`, `/documente`, `/documente/:id`)
- **State management**: React Context API and local state
- **Testing**: Jest + React Testing Library

## 🧾 Data model

The core entity is `Document`:

- `id` (unique identifier)
- `titlu` (title)
- `tip` (type)
- `emitent` (issuer)
- `data` (date)
- `status` (status)
- `descriere` (description)

## 🚀 Getting started

### ✅ Prerequisites

- Node.js (v18+ recommended)
- npm

### 📦 Install dependencies

From the workspace root:

```bash
npm install
npm run install:all
cd portal-lt1-backend
npm run db:generate
npm run db:migrate
npm run db:seed
```


### ▶️ Run (JetBrains Run button)

**Prima dată (offline pe PC):**

```bash
copy dev-network.local.env.example dev-network.local.env
npm install
npm run install:all
cd portal-lt1-backend
npm run db:generate
npm run db:migrate
npm run db:seed
```

`dev-network.local.env` are prioritate față de `dev-network.env` — nu strică deploy-ul pe cloud.

**Pornire locală (backend + frontend):**

1. Deschide `package.json` din rădăcină.
2. Apasă **Run** lângă scriptul **`dev`** (sau **`run`** — același lucru).
3. Sau din dropdown Run: **`dev (local offline)`** / **`dev (npm run)`**.

Default URLs (offline):

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

Pentru backend pe cloud în timp ce lucrezi local, șterge/redenumește `dev-network.local.env` și folosește `dev-network.env` (vezi [DEPLOY.md](./DEPLOY.md)).

## ☁️ Deploy pe Oracle Cloud (producție)

Frontend și backend pe cloud, HTTPS cu Let's Encrypt (DuckDNS, Nginx, pm2).

- **Deploy / update:** [DEPLOY.md](./DEPLOY.md)
- **`.env` PC vs server:** [ENV.md](./ENV.md)

| Serviciu | URL |
|----------|-----|
| Site | https://portal-lt1.duckdns.org |
| API | https://api-lt1.duckdns.org/health |

## 📝 Notes

- **Persistence**: Prisma + SQLite (`portal-lt1-backend/prisma/`). Use `npm run db:reset` in backend to reseed.
- **Remote demo**: set `VITE_API_BASE_URL` on the frontend VM and `ALLOWED_ORIGINS` on the backend (see [DEPLOY.md](./DEPLOY.md)).
