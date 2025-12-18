# LearnPath Biology Prototype

A duolingo-style prototype for Scottish National 5 Biology built with a React + Tailwind frontend and a lightweight Express API with mock data.

## Frontend
- Located in `frontend/`
- Vite + React scaffold with reusable components for header, course map, questions, mascot, and social feed
- Mock data lives in `frontend/src/data/mockData.js`
- Key commands (install dependencies first):
  - `npm install`
  - `npm run dev` to start the client

## Backend
- Located in `backend/`
- Express server with in-memory data and endpoints for users, lessons, completions, and leaderboards
- Key commands:
  - `npm install`
  - `npm run dev` to start the API (defaults to port 4000)

## Notes
- Data is mock-only for now and illustrates National 5 Biology lessons, XP, streaks, gems, and friend feed activity.
- Wiring the frontend to the backend will require installing dependencies and pointing API calls to the Express routes.
