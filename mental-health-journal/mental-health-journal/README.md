# MindLog — Mental Health Journal App (Step 1)

Step 1 scope: the dashboard/journal screen from the wireframe — sidebar
navigation, mood check-in, today's journal entry, past entries list, and a
calendar/streak panel — fully wired to a Node/Express/MongoDB backend.
Sentiment analysis, breathing exercises, and therapist matching are stubbed
in the sidebar as future steps.

## Folder structure

```
mental-health-journal/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   └── journalController.js   # business logic (save, history, streak)
│   ├── models/
│   │   ├── JournalEntry.js        # one document per user per day
│   │   └── User.js                # scaffold for auth (later step)
│   ├── routes/
│   │   └── journalRoutes.js       # /api/journal/*
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js                 # fetch wrapper around the backend API
│   │   └── app.js                 # UI logic (mood select, save, render)
│   ├── assets/                    # icons/images go here later
│   └── index.html
│
├── .gitignore
└── README.md
```

## How the pieces connect

- **`index.html`** lays out the 3-column UI from the wireframe: sidebar,
  main check-in + history, calendar/streak panel.
- **`app.js`** handles clicks (mood selection, Add button, sidebar nav) and
  calls **`api.js`**, which calls the Express API.
- **`server.js`** mounts `journalRoutes.js` under `/api/journal` and also
  serves the `frontend/` folder as static files — so once the backend is
  running, opening `http://localhost:5000` serves the whole app (no separate
  frontend server needed).
- **`journalController.js`** talks to MongoDB through the `JournalEntry`
  model. Every mood + journal text you submit becomes one document, keyed by
  `userId` + the day's date (`dateKey`), so hitting "Add" again the same day
  updates today's entry instead of duplicating it.
- **Calendar/streak**: computed on the fly in `getStreak()` from the set of
  days you've logged — no separate "streak" collection to keep in sync.

## API endpoints

| Method | Endpoint                | Purpose                                      |
|--------|--------------------------|-----------------------------------------------|
| POST   | `/api/journal`           | Save/update today's mood + journal text       |
| GET    | `/api/journal/today`     | Fetch today's entry (or `null`)               |
| GET    | `/api/journal/history`   | Past entries, newest first (`?limit=10`)      |
| GET    | `/api/journal/streak`    | Current streak + this month's calendar grid   |
| GET    | `/api/health`            | Health check                                  |

All endpoints currently take `userId` as a query/body param, defaulting to
`demo-user` (no login yet — that's a later step).

## Running it locally

**1. Install MongoDB** (or use a free MongoDB Atlas cluster) and have it
running on `mongodb://127.0.0.1:27017` — or grab an Atlas connection string.

**2. Backend setup**

```bash
cd backend
npm install
cp .env.example .env
# edit .env if you're using Atlas instead of local MongoDB
npm run dev        # nodemon, restarts on file changes
# or: npm start
```

You should see:
```
MongoDB connected -> 127.0.0.1/mental-health-journal
Server running on http://localhost:5000
```

**3. Open the app**

Visit `http://localhost:5000` — the frontend is served by the same Express
server, so there's nothing else to run. Pick a mood, write something, hit
**Add**, and it's saved to MongoDB. Refresh the page and it'll still be
there; the streak and past-entries panel update automatically.

## What's next (later steps, not built yet)

1. **Sentiment analysis** — score `text` on save (the `sentiment` field
   already exists on `JournalEntry`, just unpopulated) and chart mood trends
   over weeks/months on the Analytics page.
2. **Breathing exercises** — animated box / 4-7-8 / diaphragmatic guides,
   probably a self-contained page + timer component.
3. **Therapist directory** — new `Therapist` model, filter/search API,
   booking flow.
4. **Auth** — real login using the `User` model already scaffolded, so
   `userId` comes from a session instead of `localStorage`.

Let me know when you want to start on step 2 and we'll build sentiment
analysis into the entry save flow.
