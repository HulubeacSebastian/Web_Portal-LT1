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

Assignment 3 details (3NF schema, VM deployment, tests): see [docs/ASSIGNMENT3.md](docs/ASSIGNMENT3.md).

### ▶️ Run (JetBrains Run button)

1. Open the root `package.json`.
2. Use the Run icon next to script `run` (or `dev`).
3. This starts both:
   - frontend (Vite)
   - backend (Express)

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## 📝 Notes

- **Persistence**: Prisma + SQLite (`portal-lt1-backend/prisma/`). Use `npm run db:reset` in backend to reseed.
- **Remote demo**: set `VITE_API_BASE_URL` on the frontend VM and `ALLOWED_ORIGINS` on the backend (see Assignment 3 doc).
