# IdeaForge

AI-powered startup idea management platform built using MERN Stack.

## Features

- User Authentication
- JWT Authorization
- Password Hashing
- Create Ideas
- Read Ideas
- Update Ideas
- Delete Ideas
- Search Ideas
- Category Filter
- Responsive UI

## Tech Stack

Frontend:
- React
- Vite
- React Router
- Axios

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Installation

### Backend

cd server

npm install

npm run dev

### Frontend

cd client

npm install

npm run dev

## Environment Variables

PORT=5000

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

## API Routes

POST /api/auth/register

POST /api/auth/login

GET /api/ideas

POST /api/ideas

PUT /api/ideas/:id

DELETE /api/ideas/:id