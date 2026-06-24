# IdeaForge

## Day 2 Features

* User Authentication
* Login & Signup
* MongoDB Database
* CRUD Operations
* Dashboard
* Ideas Management

---

## Day 3 - Add the Brain

### Objective

Integrate a real LLM into IdeaForge.

### SDK Used

```js
const Groq = require("groq-sdk");
```

### Environment Variable

```env
GROQ_API_KEY=your_api_key
```

### Secure Key Handling

```js
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
```

### Real Model Call

```js
const completion =
await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content:
      "You are an expert startup mentor."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  model: "llama-3.3-70b-versatile"
});
```

### API Endpoint

```http
POST /api/ai/generate
```

### AI Features

* Startup Idea Generation
* Prompt Engineering
* Groq AI Integration
* Environment Variable Security

---

## Tech Stack

### Frontend

* React
* Vite
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Groq SDK

---

## Project Structure

```text
client/
server/
  ├── controllers/
  ├── routes/
  ├── config/
```

---

## Completed

✓ Authentication

✓ CRUD Operations

✓ MongoDB Integration

✓ Groq SDK Integration

✓ Real LLM Calls

✓ AI Startup Generator
