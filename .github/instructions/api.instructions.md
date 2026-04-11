---
applyTo: "api/**"
description: "Use when changing backend API code, routes, controllers, middleware, models, or backend env/runtime setup."
---

# API Instructions

## Stack
- Express + TypeScript
- MongoDB with Mongoose
- JWT authentication

## Route and Auth Rules
- Keep all backend endpoints mounted under `/api/*`.
- Existing route groups: `auth`, `notes`, `todos`, `trips`, `users`.
- Keep JWT Bearer auth flow intact.
- Any protected endpoint must use `authenticate` middleware.

## Data and Structure Rules
- Follow existing patterns in `api/src/models/interfaces` and `api/src/models/schemas`.
- Keep controllers in `api/src/controller` and route mappings in `api/src/routes`.
- Prefer minimal, additive changes over refactors.

## Runtime and Environment Rules
- Read config from `api/.env`.
- If new environment variables are introduced, update `api/.env.example` in the same change.
- Do not remove MongoDB retry logic or graceful shutdown handling in `api/index.ts` unless explicitly requested.

## Common Backend Tasks
- New endpoint:
  - Add/update interface/schema if needed.
  - Implement controller logic.
  - Register route mapping.
  - Add `authenticate` for protected routes.
- Auth changes:
  - Maintain compatibility with existing sign in/sign up/me behavior.
  - Preserve Bearer token expectations used by the client.

## Verification
- Run relevant TypeScript checks/build for backend when feasible.
- Confirm no new errors in changed backend files.

## Safety
- Never commit secrets.
- Never hardcode credentials or tokens.
