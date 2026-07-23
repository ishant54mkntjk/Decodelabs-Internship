# Student Result Management System

Full-stack CRUD app: React (Vite) frontend + Node.js/Express backend with an
in-memory data store (no database setup required).

## Project structure

```
student-result-system/
  backend/     Express API (in-memory store)
  frontend/    React dashboard (Vite)
```

## How to run

### 1. Backend

```
cd backend
npm install
npm start
```

Runs on `http://localhost:5000`.

### 2. Frontend

In a separate terminal:

```
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`. Open that URL in your browser — it talks to
the backend at `http://localhost:5000` (see `src/api.js` if you need to
change the port).

## API reference

| Method | Endpoint                        | Description                       |
|--------|----------------------------------|------------------------------------|
| GET    | `/students`                     | List all students                  |
| GET    | `/students/search?name=`        | Search students by name            |
| GET    | `/students/:id`                 | Get one student                    |
| POST   | `/students`                     | Create a student                   |
| PUT    | `/students/:id`                 | Update a student                   |
| DELETE | `/students/:id`                 | Delete a student                   |

Request/response body shape:

```json
{
  "name": "Aditi Sharma",
  "email": "aditi.sharma@mail.com",
  "course": "B.Tech CSE",
  "marks": 78
}
```

`result` (`"Pass"` / `"Fail"`) is computed server-side from `marks >= 40` and
included in every response.

### Validation rules

- `name`, `course`: required, non-empty
- `email`: required, valid email format, must be unique across students
- `marks`: required, number between 0 and 100

Validation errors return `400` with `{ success: false, errors: [...] }`.
A duplicate email returns `409`. Missing records return `404`.

## Features implemented

- Full CRUD (list, add, edit, delete) wired to the backend
- Server-side + client-side validation with inline field errors
- Search by name (backend-driven, blocks empty queries)
- Course filter (client-side, derived from loaded data)
- Statistics dashboard: total, passed, failed, average marks — recomputed
  automatically after every CRUD action
- Sorting by name / course / marks (click column headers)
- Pagination (5 rows per page)
- Toast notifications for success/error feedback
- Loading spinner while fetching
- Dark mode toggle
- Responsive layout (mobile-friendly table scroll, stacked topbar)

## Notes / possible extensions

- Data resets when the backend restarts (in-memory array). To persist data,
  swap `backend/models/studentStore.js` for a Mongoose model backed by
  MongoDB — the function signatures are designed to be a drop-in swap.
- CORS is open (`app.use(cors())`) for local development; restrict the origin
  before deploying anywhere public.
