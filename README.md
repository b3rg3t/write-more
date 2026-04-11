# Write More

Full-stack app with:

- API: Express + TypeScript + MongoDB
- Client: React + TypeScript + Vite

## Project Structure

- `api` backend service
- `client` frontend app

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm 9+
- MongoDB Atlas connection string (or a reachable MongoDB instance)

## 1. Install Dependencies

From repository root:

```bash
cd api
npm install

cd ../client
npm install
```

## 2. Configure Environment

Create `api/.env` from `api/.env.example`.

PowerShell:

```powershell
Copy-Item .\api\.env.example .\api\.env
```

Git Bash:

```bash
cp api/.env.example api/.env
```

Set values in `api/.env`:

```env
ATLAS_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

## 3. Run Locally

Run API and client in separate terminals.

Terminal 1:

```bash
cd api
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Client will be available on Vite default URL (usually `http://localhost:5173`).
API runs on `http://localhost:5000` by default.

## API Base URL Behavior

The client uses:

- development: `http://localhost:5000/api/`
- production: `https://write-more-api.vercel.app/api/`

This is defined in `client/src/store/reducers/api/util.ts`.

## Build

```bash
cd api
npm run build

cd ../client
npm run build
```

## Start API in Production Mode

```bash
cd api
npm run start
```

## Useful Scripts

API (`api/package.json`):

- `npm run dev` start backend with nodemon
- `npm run build` compile TypeScript
- `npm run start` run compiled output from `dist`

Client (`client/package.json`):

- `npm run dev` start Vite dev server
- `npm run build` type-check and build
- `npm run preview` preview production build
- `npm run lint` lint client source

## Authentication Routes

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me` (requires Bearer token)
