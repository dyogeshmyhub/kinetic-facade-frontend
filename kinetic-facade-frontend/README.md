# Kinetic Facade Control

Industrial facade operations dashboard with a React frontend, Node.js API, and PostgreSQL persistence.

## Stack

- React + Vite frontend
- Node.js + Express API
- PostgreSQL database through `pg`

## Run the connected application

1. Start PostgreSQL with `docker compose up -d postgres`, or create a PostgreSQL database named `kinetic_facade` manually.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` with the PostgreSQL credentials.
3. Install dependencies with `npm install`.
4. Start both services with `npm run dev:full`.

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:4000`.
The API creates its tables and seeds the initial motors and alarm history automatically from `server/schema.sql`.

## API routes

- `GET /api/health` checks API and database connectivity.
- `GET /api/dashboard` loads persistent system, motor, and alarm state.
- `POST /api/system/action` accepts `start`, `stop`, or `reset`.
- `PATCH /api/motors/:id` updates a motor speed.
- `POST /api/motors/sync` reloads motor telemetry.
- `POST /api/alarms/:id/acknowledge` closes an alarm.
- `POST /api/sequences/run` advances the active sequence step.

When PostgreSQL is unavailable, the browser keeps a local simulation mode and displays that state in the operator banner.
