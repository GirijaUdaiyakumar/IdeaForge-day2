# IdeaForge

Turn thoughts into startup ideas with AI-powered clarity — SaaS-style demo.

## Tech
- Frontend: React + Vite
- Backend: Node.js + Express
- DB: MongoDB (Mongoose)

## Run locally

1. Start MongoDB (local or Atlas). For local MongoDB (Windows service):

```powershell
net start MongoDB
```

Or run `mongod` with your dbpath.

2. Start backend

```bash
cd server
npm install
npm start
```

Backend will run on `http://localhost:5000`.

3. Start frontend

```bash
cd client
npm install
npm run dev
```

Frontend (Vite) default: `http://localhost:5173`.

### Run with Docker (quick)

You can run the full stack with Docker Compose (includes MongoDB):

```bash
docker compose build
docker compose up
```

- Frontend will be available at `http://localhost:5173` (served by nginx)
- Backend API at `http://localhost:5000`

### Deploy

- Frontend: `client/vercel.json` is included for Vercel static deployments.
- Server: `server/Dockerfile` provided for containerized deployments.
- Root `docker-compose.yml` provided for quick staging or local demos.

## Useful URLs
- Frontend: http://localhost:5173
- API root: http://localhost:5000/
- Ideas API: http://localhost:5000/api/ideas
- Auth API (MVP): http://localhost:5000/api/auth

## Notes
- Auth is frontend-level MVP: signup/login endpoints are placeholders and return a mock user. The frontend stores the user in `localStorage`.
- AI generation is mocked on the frontend and saves to the ideas collection.

*** End of README ***
