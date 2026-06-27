# Beacon — AI Customer Support Agent

Beacon is a live AI-powered customer support chat support agent that uses Google's Gemini AI to answer customer questions for a fictional e-commerce store called "Nova". It features a beautiful dark-themed UI, persistent conversations, Redis caching, and graceful error handling.

---

## Preview

https://github.com/user-attachments/assets/74a21b63-bec7-4c42-a344-32e4aa8fc344

---

## Live Demo

- **Frontend:** https://beaconai-by-at.vercel.app
- **Backend:** https://beacon-backend-fkxd.onrender.com

> Note: The backend is hosted on Render's free tier and may take 30-60 seconds to wake up on first request.

---

## Tech Stack

- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL 18
- **Cache:** Redis (Memurai on Windows)
- **AI Provider:** Google Gemini 2.5 Flash

---

## Running Locally

### Prerequisites

Make sure you have the following installed:
- Node.js v18 or higher
- PostgreSQL 18
- Redis (or Memurai on Windows)

### 1. Clone the repository

```bash
git clone https://github.com/atharvthakle/Beacon.git
cd beacon
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/beacon
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Set up the Database

Make sure PostgreSQL is running. Then create the database:

```bash
psql -U postgres -c "CREATE DATABASE beacon;"
```

The database tables are created automatically when the backend starts (via migrations).

### 4. Start Redis

On Windows with Memurai, it runs automatically as a service after installation.

On Mac/Linux:
```bash
redis-server
```

### 5. Run the Backend

```bash
cd backend
npm run dev
```

You should see:

✅ Connected to Redis

✅ Connected to PostgreSQL database

✅ Database migrations completed successfully

🚀 Beacon backend running on http://localhost:3001

### 6. Set up and Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open your browser and go to: `http://localhost:3000`

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 3001) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection URL |
| `GEMINI_API_KEY` | Google Gemini API key from aistudio.google.com |

---

## Architecture Overview

### Backend Structure

backend/src/

    ├── config/
    │   ├── database.ts      # PostgreSQL connection pool
    │   ├── redis.ts         # Redis client setup
    │   └── migrations.ts    # Auto-runs DB table creation on startup
    ├── middleware/
    │   └── validation.ts    # Input validation + global error handler
    ├── routes/
    │   └── chat.ts          # POST /chat/message, GET /chat/history/:sessionId
    ├── services/
    │   ├── conversation.ts  # DB operations + Redis caching logic
    │   └── llm.ts           # Gemini API integration + prompt design
    ├── types/
    │   └── index.ts         # Shared TypeScript interfaces
    └── index.ts             # Express app entry point

### How it works

1. User sends a message from the frontend
2. Backend validates the input (empty check, length check, UUID format)
3. Backend fetches or creates a conversation session
4. Conversation history is fetched — from Redis cache if available, otherwise from PostgreSQL
5. User message is saved to the database
6. Full conversation history + new message is sent to Gemini AI
7. AI response is saved to the database
8. Redis cache is invalidated so next fetch gets fresh data
9. Response is returned to the frontend with the sessionId

### Frontend Structure

frontend/

    ├── app/
    │   ├── page.tsx         # Main page
    │   └── layout.tsx       # Root layout
    └── components/
    └── beacon-chat.tsx  # Main chat component with all UI logic

### Session Persistence

- On first load, a new sessionId is created by the backend and stored in `localStorage`
- On subsequent loads, the sessionId is sent with each request and history is fetched and rendered
- This means conversations persist across browser refreshes

---

## Frontend Notes

- Built with Next.js 16 + Tailwind, generated via v0.dev and iteratively refined
- Background uses a custom WebGL "Soft Aurora" shader effect (via the `ogl` library) with mouse-reactive movement
- Custom logo and favicon

---

## LLM Notes

**Provider:** Google Gemini 2.5 Flash

**Prompting approach:**
- A detailed system prompt is injected with Nova Store's full knowledge base (shipping policy, return policy, payment methods, support hours, common issues)
- Conversation history (last 10 messages) is included with every request for contextual replies
- The AI is instructed to stay on-topic, be concise, use bullet points, and never make up information

**Cost control assumptions:**
- Max output tokens capped at 500 per response
- Only last 10 messages of history sent to the API (not entire conversation)
- These limits keep costs low while maintaining good conversational context

**Error handling:**
- Invalid API key → friendly message directing user to support email
- Rate limit exceeded → asks user to wait and retry
- Safety filter triggered → asks user to rephrase
- Any other error → generic friendly error message, never exposes internals

---
