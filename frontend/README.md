# WellMind AI — Frontend

Modern React dashboard for the WellMind AI wellness recommendation system.

## Stack

- React 18 + Vite
- Tailwind CSS (light / dark themes)
- Recharts
- React Router

## Run

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Pages

| Route | Page |
|-------|------|
| `/` | Landing |
| `/wellness-check` | Lifestyle form |
| `/dashboard` | AI results + scores + recommendations |
| `/lifestyle` | Cluster analysis charts |
| `/history` | Past checks (localStorage) |
| `/profile` | Profile + theme settings |

## API integration

With the backend running, the form calls **`POST /api/predict`** (proxied to FastAPI). If the API is down, the UI falls back to local demo scoring.

Optional env: `frontend/.env` → `VITE_API_URL=http://127.0.0.1:8000`

## Theme

Toggle light/dark from navbar or Profile page. Primary green `#4CAF50`, AI blue `#2196F3`, glassmorphism cards.
