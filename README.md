# ⚡ IdeaForge AI

**Transform Ideas into Billion-Dollar Startups with Artificial Intelligence**

A production-ready AI SaaS platform for entrepreneurs, founders, and innovators.

---

## 🚀 Features

### AI Studio
- **AI Startup Generator** — Complete startup ideas with market analysis, revenue model, tech stack
- **AI Mentor Chat** — 7 AI personas: Startup Mentor, VC Investor, CTO, Marketing Expert, Product Manager, CFO, Co-Founder
- **Market Validation** — TAM/SAM/SOM analysis, demand scoring, go/no-go recommendations
- **Competitor Analysis** — Direct competitors, moat analysis, differentiation strategy
- **Investor Pitch Deck** — Slide-by-slide investor pitch generation
- **AI Business Planner** — Full business plan with financial projections
- **Startup Readiness Radar** — 8-dimension radar chart assessment
- **Revenue Forecast** — 12-month projection with interactive charts

### Platform
- **Ideas Workspace** — Full CRUD, bookmarks, status tracking, search, filters
- **Analytics Dashboard** — Charts for ideas by status, category, and time
- **Achievements & Missions** — XP system, badges, daily missions, streaks
- **Founder Profile** — Level progression, bio, achievement display
- **Settings** — Profile, password, notifications, privacy, data export

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| AI | Groq API (LLaMA 3.3 70B) |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Deploy | Vercel (frontend) + Render (backend) |

---

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key

### Backend
```bash
cd server
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, GROQ_API_KEY
npm install
node index.js
```

### Frontend
```bash
cd client
# Set VITE_API_URL in .env
npm install
npm run dev
```

---

## 🌐 Deployment

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set `Root Directory` to `client`
3. Set `Build Command` to `npm run build`
4. Add env var: `VITE_API_URL=https://your-render-api.onrender.com`

### Backend → Render
1. Create new Web Service
2. Set `Root Directory` to `server`
3. Add environment variables from `.env`

---

## 📁 Project Structure

```
IdeaForge-day2/
├── client/              # React 19 + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # AuthContext
│   │   ├── hooks/       # useAuth
│   │   ├── pages/       # All page components
│   │   └── services/    # API service layer
│   └── vercel.json
├── server/              # Node.js + Express backend
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # Express routes
│   └── services/        # Groq AI service
└── render.yaml          # Render deployment config
```

---

## 🔐 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get profile (protected)
- `PUT /api/auth/profile` — Update profile (protected)
- `PUT /api/auth/password` — Change password (protected)

### Ideas
- `GET /api/ideas` — List ideas (protected)
- `POST /api/ideas` — Create idea (protected)
- `PUT /api/ideas/:id` — Update idea (protected)
- `DELETE /api/ideas/:id` — Delete idea (protected)
- `PATCH /api/ideas/:id/bookmark` — Toggle bookmark (protected)
- `GET /api/ideas/stats` — Idea statistics (protected)

### AI Studio
- `POST /api/ai/generate` — Generate startup idea
- `POST /api/ai/chat` — AI mentor chat
- `POST /api/ai/competitors` — Competitor analysis
- `POST /api/ai/validate` — Market validation
- `POST /api/ai/pitch` — Pitch deck generation
- `POST /api/ai/business-plan` — Business plan generation

### User
- `POST /api/user/xp` — Award XP
- `GET /api/user/missions` — Daily missions
- `POST /api/user/missions/:id/complete` — Complete mission
- `GET /api/user/badges` — Achievement badges

---

© 2026 IdeaForge AI. Built for founders, by founders.
