# REST API Endpoints

Base URL: `http://localhost:3000`

## Health

- `GET /health` -> server status

## Documents CRUD

- `GET /api/documents?page=1&limit=5&query=&status=`  
  Returns paginated documents.
- `GET /api/documents/:id`  
  Returns one document by ID.
- `POST /api/documents`  
  Creates a document (server-side validation).
- `PUT /api/documents/:id`  
  Updates a document (server-side validation).
- `DELETE /api/documents/:id`  
  Deletes a document.
- `POST /api/documents/upload` (Bearer token)  
  Simulates PDF upload metadata in RAM (`file`, `title`, `category`).

## Authentication and Users

- `POST /api/auth/login`
- `GET /api/users/profile` (Bearer token)

## Posts

- `GET /api/posts`
- `POST /api/posts` (Bearer token)
- `PUT /api/posts/:id` (Bearer token)
- `DELETE /api/posts/:id` (Bearer token)

## Contact

- `POST /api/contact`

## Statistics

- `GET /api/statistics/documents`  
  Returns:
  - total documents
  - count by status
  - count by category

## Notes

- Data is stored only in RAM (`data/documentStore.js`).
- No database and no persistent storage are used.
- Pagination is validated server-side:
  - `page >= 1`
  - `1 <= limit <= 100`
