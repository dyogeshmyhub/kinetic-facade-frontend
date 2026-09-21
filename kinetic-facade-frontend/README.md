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

## Account security and email verification

The dashboard now requires an account. Register with a full name, email, and password, verify the six-digit code, then log in. Passwords are stored as salted `scrypt` hashes, sessions use expiring random bearer tokens, and logout invalidates the active token. Profile names can be edited from the operator top bar.

For real email verification, configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` in `.env`. When SMTP is not configured in development, the API returns a development-only verification code in the registration response so the local flow remains testable. That code is never returned when `NODE_ENV=production`.

## API routes

- `GET /api/health` checks API and database connectivity.
- `GET /api/dashboard` loads persistent system, motor, and alarm state.
- `POST /api/system/action` accepts `start`, `stop`, or `reset`.
- `PATCH /api/motors/:id` updates a motor speed.
- `POST /api/motors/sync` reloads motor telemetry.
- `POST /api/alarms/:id/acknowledge` closes an alarm.
- `POST /api/sequences/run` advances the active sequence step.
- `POST /api/auth/register` creates an unverified account and sends a verification code.
- `POST /api/auth/verify` verifies the email code.
- `POST /api/auth/login` creates an authenticated session.
- `GET /api/auth/me` loads the current profile.
- `PATCH /api/auth/profile` updates the profile name.
- `POST /api/auth/logout` invalidates the current session.

When PostgreSQL is unavailable, the browser keeps a local simulation mode and displays that state in the operator banner.
