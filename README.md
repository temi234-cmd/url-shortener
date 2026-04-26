# Shortly - URL Shortener
A full-stack URL shortener application built with React, Node.js, Express, and MongoDB.

## Features

- User signup and login with JWT authentication
- URL shortening with unique 6-character codes
- Click tracking and analytics (timestamp, source)
- AI-generated insights powered by OpenRouter (Llama/Ling model)
- Protected routes — users only see their own links

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt
- **AI:** OpenRouter API (inclusionai/ling-2.6-1t:free)

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Backend
```bash
cd server
npm install
```

Create a `.env` file in the server folder:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
```

```bash
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:5173`

## Approach & Assumptions

- Kept the project simple and focused on clarity over complexity
- Used JWT stored in localStorage for authentication
- Short codes are generated using nanoid (6 characters)
- Click source is tracked via the HTTP referer header
- AI insight is generated on demand to avoid unnecessary API calls

## Trade-offs

- The app runs locally — hosting would require environment variable configuration on the deployment platform
- LocalStorage for JWT is simple but in production, httpOnly cookies would be more secure
- The free AI model (OpenRouter) may occasionally be rate-limited