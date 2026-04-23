# Alignment with `Proiect_Arhitectura_Portal_Creciunescu_Tiberiu.pdf`

Backend was aligned as much as possible with the PDF while still respecting the lab rule: **no DB / no persistence**.

## Implemented from PDF API spec

- `POST /api/auth/login`
- `GET /api/users/profile` (Bearer token)
- `GET /api/posts`
- `POST /api/posts` (Bearer token)
- `PUT /api/posts/:id` (Bearer token)
- `DELETE /api/posts/:id` (Bearer token)
- `GET /api/documents`
- `POST /api/documents/upload` (Bearer token)
- `DELETE /api/documents/:id` (Bearer token)
- `POST /api/contact`

Also kept:
- full documents CRUD from assignment
- statistics endpoint
- server-side validation
- server-side pagination
- layered architecture (`routes` / `services` / `data`)

## Intentional differences (constraint-driven)

- PDF describes PostgreSQL + file storage on disk.
- Lab assignment explicitly forbids persistence and DB usage.
- Therefore, users/posts/documents/contact messages are all stored in RAM only.
- Document upload endpoint is implemented as RAM metadata simulation for PDF filenames.
