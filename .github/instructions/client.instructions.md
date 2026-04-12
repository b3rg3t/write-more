---
applyTo: "client/**"
description: "Use when changing frontend React code, RTK Query endpoints, routing, auth UX, or Material UI components."
---

# Client Instructions

## Stack

- React + TypeScript + Vite
- Redux Toolkit Query for API integration
- Material UI for UI components

## Frontend Architecture Rules

- Use function components and existing types/interfaces in `client/src/models`.
- Keep API integration in `client/src/store/reducers/api`.
- Prefer RTK Query cache invalidation/tag patterns already used in the project.
- Avoid adding duplicate global state for server data owned by RTK Query.

## API and Auth Rules

- Preserve API base URL behavior in `client/src/store/reducers/api/util.ts`:
  - development: localhost API
  - production: deployed API URL
- Keep auth persistence and cleanup consistent with shared credential utilities.
- If signed out or unauthorized, ensure credentials are cleared and protected routes redirect to auth.

## UI and Localization Rules

- Keep all user-facing text in `client/src/localization/eng.ts` (no hardcoded UI strings in components).
- Use Material UI components and established spacing/layout patterns.
- Keep responsive behavior for mobile and desktop.
- Avoid broad redesigns unless explicitly requested.

## Common Frontend Tasks

- New data feature:
  - Add/update RTK Query endpoint/hook.
  - Connect UI component.
  - Handle loading, error, and empty states.
  - Ensure route protection when auth is required.
- Auth-related changes:
  - Keep sign in/sign out behavior consistent.
  - Ensure credential cleanup on logout and unauthorized responses.

## Verification

- Run relevant TypeScript/lint checks for client when feasible.
- Confirm no new errors in changed frontend files.

## Safety

- Never hardcode secrets or tokens in client code.
- Keep changes backward-compatible unless a breaking change is requested.
