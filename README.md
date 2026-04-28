# 📄 Document Management Portal

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)
![Node](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=fff)
![License](https://img.shields.io/badge/License-MIT-informational)

A React-based document management portal. It demonstrates a clean **master–detail UI**, **full CRUD**, and **client-side validation**, using **in-memory state** (no database) as required by the assignment scope.

## ✨ What you can do

- 📚 **Browse documents** in a paginated table (master view)
- 🔎 **Open a document** to see full details (detail view)
- ✍️ **Create, edit, and delete** documents (CRUD)
- ✅ **Validate forms** on the client for Create/Edit flows
- 🧠 **Work entirely in memory** with pre-seeded data for quick testing

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
```

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

- **Persistence**: data is intentionally **not persisted** (in-memory only).
- **Goal**: showcase UI architecture, routing, CRUD flows, and validation within the assignment constraints.
