# Quickstart: MA Training Platform

**Phase 1 Output** | **Date**: 2026-04-12

This guide gets a developer from zero to a running local development environment.

---

## Prerequisites

- Node.js 20.12+ LTS (`nvm use 20.19.0` recommended)
- Docker Desktop (for PostgreSQL + Redis)
- pnpm 9+ (`npm install -g pnpm`)
- Git

---

## 1. Clone and Install

```bash
git clone <REPOSITORY_URL>
cd MA-Courses

# Install dependencies for both workspaces
pnpm install
```

The repository root uses `pnpm` workspaces:
```
frontend/   → Nuxt.js 3 app
backend/    → Express.js API
```

---

## 2. Start Infrastructure (Docker)

```bash
# Start PostgreSQL (port 5432) + Redis (port 6379)
docker compose up -d
```

`docker-compose.yml` is at the repository root. Services use named volumes for persistence.

---

## 3. Configure Environment Variables

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

**Required backend variables** (`backend/.env`):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ma_training_dev
REDIS_URL=redis://localhost:6379

# JWT
JWT_ACCESS_SECRET=<generate: openssl rand -hex 32>
JWT_REFRESH_SECRET=<generate: openssl rand -hex 32>
JWT_ACCESS_EXPIRY=900          # 15 minutes in seconds
JWT_REFRESH_EXPIRY=604800      # 7 days in seconds

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@matraining.com
SENDGRID_FROM_NAME=MA Training

# Cloudflare R2
CLOUDFLARE_R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_BUCKET_NAME=ma-training-dev

# App
NODE_ENV=development
PORT=3001
ADMIN_CORS_ORIGIN=http://localhost:3000
```

**Required frontend variables** (`frontend/.env`):

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001/api/v1
NUXT_PUBLIC_DEFAULT_LOCALE=ar
```

---

## 4. Database Setup

```bash
cd backend

# Run migrations
pnpm prisma migrate dev

# Seed with sample data (categories, cities, instructors, sample courses)
pnpm prisma db seed
```

The seed creates:
- 5 categories (bilingual)
- 4 cities (Riyadh, Jeddah, Dammam, Abu Dhabi)
- 3 instructors
- 10 sample courses with sessions
- 2 sample workshops
- 1 admin user: `admin@matraining.com` / `Admin@1234` (**change in production**)

---

## 5. Start Development Servers

Open two terminals:

**Terminal 1 — Backend API**:
```bash
cd backend
pnpm dev
# Starts Express.js on http://localhost:3001
# BullMQ workers also start automatically
```

**Terminal 2 — Frontend**:
```bash
cd frontend
pnpm dev
# Starts Nuxt.js 3 SSR on http://localhost:3000
# /api/* proxied to http://localhost:3001/api via nitro.devProxy
```

---

## 6. Verify Setup

```bash
# Public courses API
curl http://localhost:3001/api/v1/courses | jq '.data | length'
# Should return: 10

# Public site
open http://localhost:3000

# Admin dashboard
open http://localhost:3000/admin/login
# Credentials: admin@matraining.com / Admin@1234

# BullMQ monitoring
open http://localhost:3001/admin/queues
# Requires admin JWT in Authorization header (copy from admin login response)
```

---

## 7. Run Tests

```bash
# Frontend (Vitest)
cd frontend
pnpm test               # Run once
pnpm test:watch         # Watch mode
pnpm test:coverage      # With coverage report

# Backend (Jest + Supertest)
cd backend
pnpm test               # Run once (uses test database: ma_training_test)
pnpm test:watch
pnpm test:coverage
```

The backend test suite automatically:
1. Creates a `ma_training_test` database if it doesn't exist
2. Runs `prisma migrate deploy` against the test database
3. Seeds minimal test data before each test file
4. Cleans up after each test

---

## 8. Code Quality

```bash
# TypeScript type check (both workspaces)
pnpm --filter frontend tsc --noEmit
pnpm --filter backend tsc --noEmit

# ESLint
pnpm --filter frontend lint
pnpm --filter backend lint

# Format check
pnpm --filter frontend format:check
pnpm --filter backend format:check
```

---

## 9. Key Development URLs

| URL | Purpose |
|-----|---------|
| `http://localhost:3000` | Public website (Arabic, default) |
| `http://localhost:3000/en` | Public website (English) |
| `http://localhost:3000/admin` | Admin dashboard |
| `http://localhost:3001/api/v1` | Express.js REST API |
| `http://localhost:3001/admin/queues` | Bull Board (BullMQ monitor) |

---

## 10. Common Issues

**"Cannot connect to database"**: Ensure Docker is running (`docker compose ps`) and
`DATABASE_URL` matches the Docker service port.

**"Redis connection refused"**: `docker compose up -d redis` restarts just Redis.

**"Arabic text not rendering correctly"**: Ensure your browser renders UTF-8 and the `lang="ar"`
attribute is present on `<html>` — check Nuxt DevTools for SSR output.

**"JWT expired immediately"**: Check `JWT_ACCESS_EXPIRY` is set to `900` (seconds), not `"900s"`.

**"BullMQ jobs not processing"**: Confirm `REDIS_URL` is correct in `backend/.env` and the
backend dev server started without Redis errors in the console.
