# CarePulse AI Marketing Analytics Dashboard

CarePulse is a full-stack enterprise-style web application for healthcare product marketing teams. It combines a React frontend, a Bun/Express backend API, a SQLite database, and a separate FastAPI AI assistant service.

## Tech stack
- **Frontend:** React + Vite + React Router
- **Backend:** Express on Bun
- **Database:** SQLite
- **AI service:** FastAPI + optional GPT-4o-mini integration
- **Authentication:** Token-based authentication using signed bearer tokens

## Core features
- User registration, login, logout
- Password hashing with `Bun.password.hash`
- Token-based authentication
- Two user roles: **admin** and **analyst**
- Full CRUD for **campaigns** and **customer segments**
- Analytics report viewing and admin-only report generation
- Protected frontend routes
- Role-based UI behavior and backend role enforcement
- AI assistant integration with saved conversation history
- Input validation and centralized backend error handling
- Environment-based configuration
- Client and server logging
- Seed data and database setup scripts

## Project structure
- `frontend/` — React UI
- `PulseAPI/` — Bun/Express API
- `app/` — FastAPI AI assistant microservice
- `data/` — synthetic large-scale data files for demos and testing
- `docs/` — API docs and data model docs
- `screenshots/` — submission screenshots

## Run the project
Open **three terminals** from the project root.

### 1. Main backend API
```bash
cd PulseAPI
bun install
bun run setup
bun run seed
bun run dev
```
Runs on `http://localhost:8080`

### 2. AI assistant service
```bash
cd app
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r ../requirements.txt
cp ../.env.example ../.env
bash ../run.sh
```
Runs on `http://127.0.0.1:8000`
Docs on `http://127.0.0.1:8000/docs`

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Runs on `http://localhost:5173`

## Demo accounts
Seed scripts create these accounts:
- **Admin:** `admin@carepulse.com` / `password123`
- **Analyst:** `analyst@carepulse.com` / `password123`

## Validation, logging, and errors
- Backend request logging: `PulseAPI/middleware/logger.js`
- Backend auth and role checks: `PulseAPI/middleware/auth.js`
- Backend validation: `PulseAPI/middleware/validate.js`
- Backend error middleware: `PulseAPI/middleware/errorHandlers.js`
- Frontend API logging: `frontend/src/service/logger.js`

## API documentation
See `docs/API_DOCUMENTATION.md`

## Data model diagram
See `docs/DATA_MODEL.md`

## Screenshots
See the `screenshots/` folder.
