# Magic Craft Gallery - E-commerce (NestJS + MongoDB, Single Server)

A modern e-commerce site for a Sri Lankan craft gallery.
**One server runs everything:** NestJS + MongoDB Atlas backend serves the built React frontend (`dist/`) - no separate frontend server needed.

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite 7, Lucide icons |
| Backend | **NestJS 10** (Express), Mongoose 8 |
| Database | **MongoDB Atlas** (replaces Supabase) |
| Auth | Admin login -> JWT Bearer token (7 days) |
| Hosting | Single Node server serves `dist/` + `/api/*` |

## Project Structure

```
mcg/
|-- src/                  # React frontend
|   |-- api.js            # API client -> same-server /api/*
|   |-- App.jsx           # loads catalog from /api/products
|   |-- supabaseClient.js # DEPRECATED stub (old imports only)
|   \-- components/       # Home, Shop, ProductDetail, Cart, Checkout, Contact, AdminPanel, Nav ...
|-- dist/                 # production frontend build (served by backend)
|-- backend/              # NestJS API (single server)
|   |-- .env              # MONGODB_URI (Atlas password) + admin creds
|   |-- .env.example
|   \-- src/
|       |-- main.ts       # serves ../dist + API on one port
|       |-- app.module.ts
|       |-- spa.middleware.ts  # /shop, /product/:id -> dist/index.html
|       |-- auth/         # POST /api/auth/login, AdminGuard (JWT)
|       |-- products/     # CRUD /api/products
|       |-- reviews/      # /api/products/:id/reviews
|       |-- orders/       # POST /api/orders (+ stock decrement)
|       |-- messages/     # POST /api/messages (contact form)
|       \-- seed.ts       # sample products
|-- package.json          # frontend scripts (+ build:full, start)
\-- README.md
```

## Setup

### 1. Put your MongoDB Atlas password in `.env`

Open **`backend/.env`** and replace `<ATLAS_PASSWORD>`:

```env
MONGODB_URI=mongodb+srv://mcgadmin:<ATLAS_PASSWORD>@cluster0.ab12c.mongodb.net/mcg?retryWrites=true&w=majority&appName=Cluster0
PORT=3000
ADMIN_USER=orange
ADMIN_PASS=123
JWT_SECRET=mcg-super-secret-change-me
JWT_EXPIRES_IN=7d
```

> Hostname/user above are examples - keep your own cluster host + DB user, just swap the password. Never commit the real `.env`.

### 2. Install

```bash
npm install
npm install --prefix backend
```

### 3. Seed sample products (optional)

```bash
npm run seed --prefix backend
```

Skips automatically if products already exist.

### 4. Run - SINGLE SERVER (what you asked for)

```bash
npm run build                      # frontend -> dist/
npm run build --prefix backend     # NestJS -> backend/dist
npm start                          # = start backend on http://localhost:3000
```

One URL serves **both**:

- `http://localhost:3000/` -> storefront (from `dist/`)
- `http://localhost:3000/api/...` -> API

Dev mode (two terminals, hot reload):

```bash
npm run dev                  # frontend :5173, proxies /api -> :3000
npm run dev --prefix backend # backend :3000
```

## Quick Local Development Guide

**Single Server Mode** (recommended for development):

1. **Setup Phase** (run once):
   ```bash
   # 1. Set up your MongoDB Atlas credentials
   # Edit backend/.env with your actual Atlas password

   # 2. Install all dependencies
   npm install
   npm install --prefix backend

   # 3. (Optional) Seed initial products
   npm run seed --prefix backend
   ```

2. **Run the App** (in one terminal for single server, two for dev mode):
   - **Single Server** (what you asked for):
     ```bash
     npm run build                    # Build frontend
     npm run build --prefix backend   # Build backend
     npm start                        # Run single server on localhost:3000
     ```
     - **Development Mode** (hot reload):
     ```bash
     npm run dev                       # Frontend dev server on :5173
     npm run dev --prefix backend       # Backend dev server on :3000
     ```

**URLs after starting**:
- `http://localhost:3000/` - Full storefront (React app)
- `http://localhost:3000/api/...` - All API endpoints
- `http://localhost:3000/admin` - Admin panel (use `orange`/`123`)

**Troubleshooting**:
- **Missing products?** Run `npm run seed --prefix backend`
- **Admin login issues?** Check `backend/.env` for `ADMIN_USER`/`ADMIN_PASS`
- **Database connection errors?** Verify your MongoDB Atlas password and IP whitelist settings
- **API issues?** Ensure the backend runs from project root to serve `dist/` correctly

## API Reference (same origin)

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | - | `{ status: "ok" }` |
| POST | `/api/auth/login` | - | `{ username, password }` -> `{ access_token }` |
| GET | `/api/products?search=&inStock=` | - | list (inStock=true hides sold-out) |
| GET | `/api/products/top-rated` | - | top 3 by rating |
| GET | `/api/products/:id` | - | single product |
| POST | `/api/products` | admin | create |
| PATCH | `/api/products/:id` | admin | update price/stock/soldOut |
| DELETE | `/api/products/:id` | admin | delete |
| GET | `/api/products/:id/reviews` | - | list reviews |
| POST | `/api/products/:id/reviews` | - | `{ rating 1-5, text, author? }` |
| POST | `/api/orders` | - | place order (decrements stock) |
| GET | `/api/orders` | admin | list orders |
| PATCH | `/api/orders/:id` | admin | `{ status }` |
| POST | `/api/messages` | - | contact form |
| GET | `/api/messages` | admin | list messages |

Admin header: `Authorization: Bearer <access_token>`


## Admin Panel Guide

Open **`http://localhost:3000/admin`** (or the gear icon in the navbar).

### Login

- **Username:** `orange` / **Password:** `123`
- Change in `backend/.env` (`ADMIN_USER` / `ADMIN_PASS`).
- Login calls `POST /api/auth/login`; JWT saved in `localStorage` (`mcg_admin_token`) and auto-attached to admin requests. Refresh keeps you logged in (7 days).

### What the admin can do

| Action | How | API |
| --- | --- | --- |
| Add product | Fill name/price/stock/desc, **Upload image** from PC (preview shown), optionally **+ Add Variant** rows -> **+ Add Product** | `POST /api/products` (images via `POST /api/uploads/image`) |
| Edit product | **Edit** on a row loads everything (incl. variants) into the form -> **Save changes** / Cancel | `PATCH /api/products/:id` |
| Add variant | **+ Add Variant** -> per-variant name, unique SKU, price LKR, stock, description, image upload + preview | embedded in product |
| Edit/remove variant | Edit any variant field inline; **Remove** drops that variant card only | embedded in product |
| Update stock | -/+ stepper or type number | `PATCH /api/products/:id { stock }` |
| Toggle sold-out | Flip green switch | `PATCH /api/products/:id { soldOut }` |
| Delete product | **Delete** button (confirms first) | `DELETE /api/products/:id` |
| View orders* | `GET /api/orders` with token (Postman) | admin only |
| View messages* | `GET /api/messages` with token | admin only |

Image rules: JPG/JPEG/PNG/WebP only, max 5MB, stored under `dist/uploads` and served by the same server (`/uploads/...`). Variant SKUs must be unique per product.

*Orders/messages have API endpoints but no on-screen table yet - use Postman/curl with the admin token, or ask to add an Orders tab.*

### Quick Postman test

```
POST http://localhost:3000/api/auth/login
{ "username": "orange", "password": "123" }
-> copy access_token

GET http://localhost:3000/api/products
POST http://localhost:3000/api/products   (Header: Authorization: Bearer <token>)
{ "name": "Test Mask", "description": "...", "price": 1500, "stock": 5 }
```

### Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Invalid credentials` | Check ADMIN_USER/PASS in backend/.env, restart |
| `401 Missing admin token` | Login again - token expired/cleared |
| Empty shop | `npm run seed --prefix backend` |
| Mongoose connection error | Wrong Atlas password / IP not whitelisted |
| `/api` fails but site loads | Backend must run from repo root so it finds `dist/` |

## Pages and Routes (single server)

- `/` home, `/shop` catalog + search, `/product/:id` detail + reviews
- `/cart`, `/checkout` (POST /api/orders), `/about`, `/contact` (POST /api/messages)
- `/admin` panel (JWT login)
- Direct URLs + back/forward work via SPA fallback to `dist/index.html`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | frontend :5173, proxies /api to :3000 |
| `npm run dev --prefix backend` | backend :3000 |
| `npm run build` | frontend -> `dist/` |
| `npm run build --prefix backend` | backend -> `backend/dist` |
| `npm run build:full` | build both |
| `npm start` | **single server** :3000 (prod) |
| `npm run seed --prefix backend` | 3 sample products |
| `npm run lint` | ESLint |

## Migration notes (Supabase -> MongoDB)

- `src/supabaseClient.js` is a deprecated stub; all data via `src/api.js` -> NestJS -> MongoDB.
- Renames: `sold_out` -> `soldOut`, `avg_rating` -> `avgRating`, numeric id -> ObjectId string.
- Reviews update avgRating server-side; orders decrement stock; cart stays in React state.
