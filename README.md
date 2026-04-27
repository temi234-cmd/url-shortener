# Shortly — URL Shortener

A full-stack URL shortener application built with the MERN stack. Shorten long URLs, track click analytics, and get AI-powered insights — all from a clean, simple interface.

🔗 **Live Demo**: [url-shortener-henna-eight.vercel.app](https://url-shortener-henna-eight.vercel.app)
📁 **Repository**: [github.com/temi234-cmd/url-shortener](https://github.com/temi234-cmd/url-shortener)

---

## Features

- **User Signup / Sign-in** — Secure authentication with JWT + bcrypt
- **URL Shortening** — Generates unique 6-character short codes via nanoid
- **Click Analytics** — Tracks click count, timestamps, and traffic source (HTTP referer)
- **AI-Powered Insights** — On-demand LLM-generated summary of link performance via OpenRouter
- **Protected Routes** — Users can only view and manage their own links

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Short Code Generation | nanoid |
| AI Insights | OpenRouter API (inclusionai/ling-2.6-1t:free) |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js installed
- MongoDB Atlas account
- OpenRouter API key (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/temi234-cmd/url-shortener.git
cd url-shortener
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Project Structure

```
url-shortener/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/          # Express backend
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── index.js
├── .gitignore
└── README.md
```

---

## Approach, Assumptions & Trade-offs

### Approach
The app follows a standard REST API architecture. The React frontend communicates with the Express backend via Axios. Short codes are generated using **nanoid** (6 characters) and stored in MongoDB alongside the original URL and click metadata. On redirect, the server logs the click event (timestamp + HTTP referer) before forwarding the user to their destination.

AI insights are generated **on demand** using the OpenRouter API, passing the link's analytics data as context to the LLM.

### Assumptions
- Users must be signed in to create and manage shortened links
- Click source is inferred from the HTTP `Referer` header — this may be absent for direct traffic
- The free OpenRouter model is sufficient for generating short, data-driven insights
- JWT stored in localStorage is acceptable for this scope

### Trade-offs
- **localStorage for JWT** — Simple and straightforward for this task; httpOnly cookies would be more secure in a production environment
- **Free AI model** — The OpenRouter free tier (Ling model) may occasionally be rate-limited under heavy usage; a paid model would be more reliable
- **No custom slugs** — Short codes are auto-generated via nanoid to keep scope minimal; custom aliases could be added as a future enhancement
- **No link expiry** — Links persist indefinitely; expiration logic was intentionally left out of scope
- **AI on demand** — Insights are only generated when the user requests them, avoiding unnecessary API calls and staying within free-tier limits

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | [Vercel](https://vercel.com) | Deployed as a static React (Vite) build |
| Backend | [Render](https://render.com) | Deployed as a Node.js web service |

### To deploy your own instance:

**Backend (Render):**
1. Create a new **Web Service** on Render and connect your GitHub repo
2. Set the root directory to `server`
3. Set the build command to `npm install` and start command to `npm start`
4. Add your environment variables (`MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`) in the Render dashboard

**Frontend (Vercel):**
1. Import the repo into [Vercel](https://vercel.com)
2. Set the root directory to `client`
3. Add your environment variable pointing to your Render backend URL (e.g. `VITE_API_URL=https://your-app.onrender.com`)

