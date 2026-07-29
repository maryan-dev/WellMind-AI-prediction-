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

Optional env: `frontend/.env` → `VITE_API_URL=http://127.0.0.1:8000` (see `.env.example`)

## Vercel (fix failed deploys)

1. **Project Settings → General → Root Directory:** `frontend` (required)
2. **Framework Preset:** Vite (auto-detected)
3. **Build Command:** `npm run build` (default)
4. **Output Directory:** `dist` (default)
5. **Do not** enable Python / Serverless for this repo
6. **Environment:** `VITE_API_URL` = your API URL (or leave empty for UI-only demo; predict needs API elsewhere)

Redeploy after push. If error in **2s**, Root Directory is usually wrong. If **500 MB**, Python was bundled — use frontend only.

Config file: `frontend/vercel.json` only (no root `vercel.json`).


Toggle light/dark from navbar or Profile page. Primary green `#4CAF50`, AI blue `#2196F3`, glassmorphism cards.
