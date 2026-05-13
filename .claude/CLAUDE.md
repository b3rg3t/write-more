# Write More — Project Instructions

## Global Rules

- Make minimal, focused changes.
- Preserve existing naming and folder structure.
- Avoid adding new dependencies unless necessary.
- Add concise comments only for non-obvious logic.
- Do not refactor unrelated code in feature/fix tasks.

## Verification

- Run relevant checks for changed areas when feasible.
- Confirm no new errors in changed files.
- Mention any unverified parts if execution is not possible.

## Safety

- Never commit secrets.
- Never hardcode tokens or credentials.
- Keep changes backward-compatible unless a breaking change is requested.

---

## API (`api/**`)

**Stack:** Express + TypeScript, MongoDB + Mongoose, JWT authentication

### Route and Auth Rules
- Keep all backend endpoints mounted under `/api/*`.
- Existing route groups: `auth`, `notes`, `todos`, `trips`, `users`.
- Keep JWT Bearer auth flow intact.
- Any protected endpoint must use `authenticate` middleware.

### Data and Structure Rules
- Follow existing patterns in `api/src/models/interfaces` and `api/src/models/schemas`.
- Keep controllers in `api/src/controller` and route mappings in `api/src/routes`.
- Prefer minimal, additive changes over refactors.

### Runtime and Environment Rules
- Read config from `api/.env`.
- If new environment variables are introduced, update `api/.env.example` in the same change.
- Do not remove MongoDB retry logic or graceful shutdown handling in `api/index.ts` unless explicitly requested.

### Common Backend Tasks
- New endpoint: add/update interface/schema → implement controller → register route → add `authenticate` for protected routes.
- Auth changes: maintain compatibility with existing sign in/sign up/me behavior and preserve Bearer token expectations.

---

## Client (`client/**`)

**Stack:** React + TypeScript + Vite, Redux Toolkit Query, Material UI

### Frontend Architecture Rules
- Use function components and existing types/interfaces in `client/src/models`.
- Keep API integration in `client/src/store/reducers/api`.
- Prefer RTK Query cache invalidation/tag patterns already used in the project.
- Avoid adding duplicate global state for server data owned by RTK Query.

### API and Auth Rules
- Preserve API base URL behavior in `client/src/store/reducers/api/util.ts` (development: localhost, production: deployed URL).
- Keep auth persistence and cleanup consistent with shared credential utilities.
- If signed out or unauthorized, ensure credentials are cleared and protected routes redirect to auth.

### UI and Localization Rules
- **Always** keep all user-facing text in `client/src/localization/eng.ts` — never hardcode UI strings in components.
- Use Material UI components and established spacing/layout patterns.
- Keep responsive behavior for mobile and desktop.
- Avoid broad redesigns unless explicitly requested.

### Common Frontend Tasks
- New data feature: add/update RTK Query endpoint/hook → connect UI → handle loading, error, and empty states → ensure route protection.
- Auth-related changes: keep sign in/sign out behavior consistent and ensure credential cleanup on logout and unauthorized responses.

### MUI
- When working with Material UI components, use MUI MCP tools (`mcp_mui-mcp_useMuiDocs`, `mcp_mui-mcp_fetchDocs`) for accurate documentation rather than relying on general knowledge.

---

## Project Configuration

## Editor

- Format on save: enabled
- Default formatter: Prettier (`esbenp.prettier-vscode`)

## MCP Servers

- **mui-mcp**: `npx -y @mui/mcp@latest` (stdio)

## Debug Configurations

### Debug API
- Runtime: `ts-node/register`
- Entry: `api/index.ts`
- CWD: `api/`
- Env file: `api/.env`
- `NODE_ENV=development`, `DEBUG=app:*`
- Source maps enabled, restarts on change

### Debug API (nodemon)
- Runtime: nodemon with `ts-node/register`
- Same entry, env, and source map settings as above

### Attach to API
- Attach mode on port `9229`
- Source maps enabled, restarts on disconnect
