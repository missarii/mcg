# MCG Gallery – Local Run & Host Setup

Run the whole MCG Gallery stack (React frontend + NestJS backend + MongoDB Atlas) **fully locally**.

> The project is **single‑server**: the NestJS backend (`node backend/dist/main.js`) serves both the built React app (`dist/`) and the `/api` routes on **port 3000**. No separate frontend server is needed.

---

## 🚀 One-Command Quick Start (if MongoDB Atlas is already configured)

```bash
# From project root (/home/missari/mcg)
npm install && npm install --prefix backend && npm run build && npm run build --prefix backend && npm start
# Server starts on http://localhost:3000
```

> **Test creds are already in place**: The existing `backend/.env` uses `missari:missari123` MongoDB Atlas credentials. If you have your own Atlas cluster, update `backend/.env` first (see §1.2).

## Prerequisites

- **Node.js** `20 LTS` + **npm**
- **MongoDB Atlas** credentials (replace `<ATLAS_PASSWORD>` in `.env`)
- (Optional) **Docker** & **docker-compose** for containerized local run

---

## 1. Native Node – single server (recommended for fast local dev)

### 1.1 Install dependencies

```bash
# from the project root
npm install                    # React / Vite deps
npm install --prefix backend   # NestJS + Mongoose deps
```

### 1.2 Environment

```bash
cp backend/.env.example backend/.env
# edit backend/.env and fill:
#   MONGODB_URI=mongodb+srv://mcgadmin:<ATLAS_PASSWORD>@cluster0.xxx.mongodb.net/mcg?retryWrites=true&w=majority&appName=Cluster0
#   PORT=3000
#   ADMIN_USER=orange
#   ADMIN_PASS=123
#   JWT_SECRET=mcg-super-secret-change-me
#   JWT_EXPIRES_IN=7d
#   (optional) CLOUDINARY_URL=cloudinary://<cloud_name>:<api_key>.<api_secret>@<cloud_name>
```

> The existing `backend/.env` already has test creds `missari:missari123` – you can keep those.

### 1.3 Build the React frontend

```bash
npm run build               # vite build → dist/
```

### 1.4 Build the NestJS backend

```bash
npm run build --prefix backend   # nest build → backend/dist/
```

### 1.5 Start the server

```bash
npm start                   # node backend/dist/main.js
# or explicitly:
node backend/dist/main.js
```

The single server will listen on **http://localhost:3000**.

### 1.6 Verify

```bash
# Health check
curl http://localhost:3000/api/health
# → {"status":"ok","service":"mcg-backend","time":"..."}

# React index page
curl http://localhost:3000/
# → <!doctype html> ...

# Sample API
curl http://localhost:3000/api/products
# → [ { "_id": "...", "name": "...", ... } ]

# Admin login (default orange/123)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"orange","password":"123"}'
```

### 1.7 Stop

```bash
pkill -f "node backend/dist/main.js"
# or press Ctrl+C in the terminal where npm start was run
```

### 1.8 (Optional) Seed sample products

```bash
npm run seed --prefix backend
# → "Seeded 3 products."  (skips if products already exist)
```

This inserts 3 sample products (Dumbara Mat, Clay Pottery Vase, Brass Oil Lamp) into MongoDB.

### 1.9 Dev mode (hot reload, two terminals)

```bash
# Terminal 1 – backend (NestJS with ts-node, auto-reload on save)
npm run dev --prefix backend
# → NestJS API on http://localhost:3000

# Terminal 2 – frontend (Vite with HMR)
npm run dev
# → React on http://localhost:5173 (proxies /api/* → :3000)
```

Open **http://localhost:5173** for the dev storefront with hot reload.

---

## 2. Docker Compose (optional)

The repo already ships a `docker-compose.yml`. If you prefer Docker:

```bash
docker compose up --build -d
docker compose logs -f mcg-backend
```

Verify exactly the same endpoints as native mode on `http://localhost:3000`.

> The Dockerfile builds the NestJS backend from `backend/` and mounts `./dist` (the pre-built React app). Run `npm run build` once before `docker compose up` so `dist/` exists.

---

## 📦 Complete Host Setup (Production-like single server)

For a production-ready local host that mimics the deployed environment (e.g., Render, Railway, VPS):

```bash
# 1. Clone / cd to project
cd /home/missari/mcg

# 2. Install all deps (frontend + backend)
npm ci && npm ci --prefix backend

# 3. Configure environment (edit if needed)
cp backend/.env.example backend/.env
# nano backend/.env  # fill MONGODB_URI with your Atlas password

# 4. Build frontend (outputs to dist/)
npm run build

# 5. Build backend (outputs to backend/dist/)
npm run build --prefix backend

# 6. Start production server (single process, port 3000)
# Use PM2 for process management in production:
npm install -g pm2
pm2 start backend/dist/main.js --name mcg -- --port 3000
# Or run directly (for quick test):
node backend/dist/main.js

# 7. Verify
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/ | head -1
```

**PM2 commands:**
```bash
pm2 list              # show status
pm2 logs mcg          # tail logs
pm2 stop mcg          # stop
pm2 restart mcg       # restart
pm2 delete mcg        # remove
pm2 startup           # generate systemd init script
```

---

## Environment Variables (required)

| Variable            | Description                                           |
|---------------------|-------------------------------------------------------|
| `MONGODB_URI`       | MongoDB Atlas connection string                       |
| `PORT`              | `3000` (NestJS listens here)                          |
| `ADMIN_USER`        | Admin login user (default `orange`)                   |
| `ADMIN_PASS`        | Admin login pass (default `123`)                      |
| `JWT_SECRET`        | JWT signing secret (change in production!)            |
| `JWT_EXPIRES_IN`    | `7d`                                                  |
| `CLOUDINARY_URL`    | Cloudinary credentials for image uploads              |

> **Never** commit `backend/.env` – it is already in `.gitignore`.

---

## Run Commands (copy → paste to run locally)

```bash
# All-in-one:
cd /home/missari/mcg
npm install && npm install --prefix backend && npm run build && npm run build --prefix backend && npm start

# Or step-by-step:
npm install                    # 1. React / Vite deps
npm install --prefix backend   # 2. NestJS + Mongoose deps
cp backend/.env.example backend/.env   # 3. env (fill Atlas password)
npm run build                  # 4. frontend → dist/
npm run build --prefix backend  # 5. NestJS → backend/dist/
npm start                      # 6. server on :3000
npm run seed --prefix backend # 7. optional seed
```

## Quick Checklist

- [ ] `npm install` (root) + `npm install --prefix backend`
- [ ] `cp backend/.env.example backend/.env` and fill Atlas password
- [ ] `npm run build` (frontend → `dist/`)
- [ ] `npm run build --prefix backend` (backend → `backend/dist/`)
- [ ] `npm start` (or `node backend/dist/main.js`)
- [ ] `curl http://localhost:3000/api/health` → `200 {"status":"ok",...}`
- [ ] `curl http://localhost:3000/` → React HTML

---

## Troubleshooting

| Symptom                                | Fix                                                        |
|----------------------------------------|------------------------------------------------------------|
| `Mongoose connection error`              | Check Atlas password & IP whitelist.                       |
| `Invalid credentials` on `/api/auth/login` | Verify `ADMIN_USER` / `ADMIN_PASS` in `backend/.env`.     |
| Frontend loads but API 404               | Run `npm run build --prefix backend` after TS changes.    |
| `401 Missing admin token`                | Login again – JWT expires after 7 days.                    |

---

## Files quick‑ref

| Path                   | Purpose                                               |
|------------------------|-------------------------------------------------------|
| `vite.config.js`       | Vite + `/api` proxy to `localhost:3000`               |
| `Dockerfile`           | Multi‑stage NestJS build (Node 20 Alpine)            |
| `render.yaml`          | Render blueprint (static site + Docker web service)  |
| `backend/.env.example` | Required env‑vars list                                |
| `backend/.env`         | **Your** local env (never committed)                  |
| `dist/`                | Production React build (`npm run build`)             |
| `backend/dist/`        | Compiled NestJS (`npm run build --prefix backend`)   |
| `readm.md`             | This file                                             |