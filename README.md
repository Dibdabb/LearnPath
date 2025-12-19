# LearnPath Biology Prototype

A Duolingo-style National 5 Biology prototype with a React + Tailwind client and an Express + Prisma API using SQLite persistence.

## Getting started

1. Install dependencies for all packages (root, backend, frontend):
   ```bash
   npm install          # installs root dev tooling
   npm install --prefix backend
   npm install --prefix frontend
   ```
2. Create the database and seed quests/demo data:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run seed
   cd ..
   ```
3. Launch both backend and frontend together:
   ```bash
   npm run dev
   ```
   - API runs on http://localhost:4000
   - Frontend runs on http://localhost:5173 (Vite) and uses `VITE_API_URL` to target the API

## Backend highlights
- SQLite persistence via Prisma models: **User, Profile, Progress, Inventory, Boost, Quest, QuestProgress, WeeklyXp**
- Auth endpoints: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- Lesson endpoints with prerequisite gating: `/api/lessons`, `/api/lessons/:lessonId/complete`
- Economy + boosts: `/api/shop/items`, `/api/shop/buy`, `/api/boosts/activate`, `/api/boosts/active`, `/api/inventory`
- Quests: `/api/quests` auto-grant gems/XP when targets are met
- Default new user values enforced in the backend (xp/gems/streak/weeklyXp/inventory all start at zero)

## Frontend highlights
- Duolingo-inspired learn page with left rail navigation, center learn path, and right rail quests/shop
- Custom golden wolf mascot SVG visible by default in the sidebar and headers
- Animated low-opacity DNA helix background on the learn page
- Vertical learn path with locked lessons until prerequisites complete; completing a lesson awards XP/gems and updates quests
- Shop + boost controls with active boost display and inventory counts

## Environment
- Backend env example: `backend/.env.example`
- Default database: `file:./dev.db` (SQLite)
