# Write More Copilot Instructions

Scoped instructions are split by area:
- API instructions: `.github/instructions/api.instructions.md`
- Client instructions: `.github/instructions/client.instructions.md`

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
