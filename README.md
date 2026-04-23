# Portal LT1 (Frontend + Backend)

Monorepo pentru proiectul **Portal LT1**:

- `portal-lt1-frontend` — React + Vite (UI, validare client-side, offline CRUD + sync)
- `portal-lt1-backend` — Node.js + Express (REST API, validare server-side, RAM-only, Faker generator, WebSocket push)

> Important: conform cerințelor de laborator, **NU există persistency**. Datele din backend sunt doar în RAM. La restart server, se resetează.

## Cerințe

- Node.js (recomandat LTS)
- npm

## Rulare locală (2 terminale)

### Backend

```bash
cd portal-lt1-backend
npm install
npm start
```

Backend pornește pe `http://localhost:3000` și WebSocket pe `ws://localhost:3000`.

### Frontend

```bash
cd portal-lt1-frontend
npm install
npm run dev
```

Frontend pornește implicit pe `http://localhost:5173`.

## Testare (unit + coverage + e2e)

### Backend (Jest + Supertest + coverage thresholds)

```bash
cd portal-lt1-backend
npm test
```

Acoperă:

- CRUD documents + statistics
- auth/login + profile
- CRUD posts
- contact
- generator start/stop (Faker)
- validări server-side pentru input-uri

### Frontend (Vitest + Testing Library + coverage thresholds)

```bash
cd portal-lt1-frontend
npm run test
npm run test:coverage
```

Acoperă:

- CRUD UI pentru documente (create/edit/delete) + validări
- validări pentru login/register/contact/documents + upload/posts

### E2E (Playwright)

```bash
cd portal-lt1-frontend
npm run test:e2e
```

## Validare rapidă a funcționalităților Silver (offline + sync + websockets)

### 1) Offline CRUD + sync

1. Pornește **backend** și **frontend**.
2. Intră pe pagina `Documente` și fă un CRUD (ex: adaugă un document) ca să confirmi că totul e ok online.
3. Oprește backend-ul (sau dezactivează conexiunea).
4. Repetă CRUD în UI:
  - documentele se modifică local (în `localStorage`)
  - operațiile se pun în coadă (queue)
5. Pornește backend-ul la loc / revino online:
  - queue-ul se sincronizează automat cu serverul
  - lista se reîncarcă din server

Notă: offline storage chei:

- `offline_documents`
- `offline_documents_queue`

### 2) Generator fake entities (Faker) + WebSocket push

Generatorul adaugă periodic documente valide în RAM și trimite notificări prin WebSocket, iar UI își face refresh automat.

1. Login pentru token (Bearer JWT):

```bash
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@lt1.ro\",\"password\":\"admin123\"}"
```

1. Start generator (înlocuiește `TOKEN` cu token-ul din răspuns):

```bash
curl -X POST http://localhost:3000/api/documents/generator/start ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer TOKEN" ^
  -d "{\"batchSize\":5,\"intervalMs\":2000}"
```

1. Deschide pagina `Documente` în frontend:
  - vei vedea periodic documente noi
  - master/detail + graficele se actualizează la broadcast
2. Stop generator:

```bash
curl -X POST http://localhost:3000/api/documents/generator/stop ^
  -H "Authorization: Bearer TOKEN"
```

## Endpoint-uri utile (backend)

- `GET /health`
- `GET /api/documents?page=1&limit=10`
- `POST /api/documents` (Bearer)
- `PUT /api/documents/:id` (Bearer)
- `DELETE /api/documents/:id` (Bearer)
- `POST /api/documents/upload` (Bearer, simulare upload PDF metadata)
- `GET /api/statistics/documents`
- `POST /api/auth/login`
- `GET /api/users/profile` (Bearer)
- `GET /api/posts`
- `POST /api/posts` (Bearer)
- `PUT /api/posts/:id` (Bearer)
- `DELETE /api/posts/:id` (Bearer)
- `POST /api/contact`
- `POST /api/documents/generator/start` (Bearer)
- `POST /api/documents/generator/stop` (Bearer)
- `GET /api/documents/generator/status` (Bearer)

# Document Management Portal - Assignment 1

A front-end React application built for Assignment 1. This project implements a document management system featuring a master-detail interface, full CRUD operations, and form validations, utilizing entirely in-memory data storage as per the assignment requirements (Bronze level).

## 🚀 Features

- **Presentation Page:** Landing page featuring the project logo, name, tagline, and a brief description.
- **Master View (Document List):** A data table displaying all documents with **pagination** support.
- **Detail View:** A dedicated page to view the complete details of a specific document.
- **Full CRUD Functionality:** * Create new documents.
  - Read (view list and details).
  - Update existing documents.
  - Delete documents.
- **Form Validation:** Client-side validation for all data entry forms (Create/Edit).
- **In-Memory Storage:** Data is managed entirely in RAM using React state/context (no external database), pre-loaded with seed data for testing.
- **Separation of Concerns:** Clean architecture separating UI components from business logic and state management.

## 🛠️ Tech Stack

- **Frontend:** React.js
- **State Management:** React Context API / Local State
- **Routing:** React Router (handling `/`, `/documente`, `/documente/:id`, etc.)
- **Testing:** Jest & React Testing Library (Unit & Component tests)

## 📦 Entity Structure

The core data model for this application is the `Document` entity, which includes the following properties:

- `id` (Unique identifier)
- `titlu` (Title)
- `tip` (Type)
- `emitent` (Issuer)
- `data` (Date)
- `status` (Status)
- `descriere` (Description)

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Install Dependencies

From the workspace root:

```bash
npm install
npm run install:all
```

### Run From JetBrains Run Button

1. Open the root `package.json`.
2. Use the Run icon next to script `run` (or `dev`).
3. This starts both:
  - frontend (Vite)
  - backend (Express)

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

