# Angular Learning Lab

An open, bilingual (Arabic/English) learning platform built alongside a step-by-step Angular learning journey.

## Initial product decisions

- Angular: latest stable release supported by the official compatibility table at implementation time.
- Package manager: pnpm only.
- UI: latest stable PrimeNG compatible with the selected Angular version.
- Data: local JSON files for lesson/catalog content in the first iteration; no backend.
- Languages: Arabic and English, with real RTL/LTR layout support.
- AI coding agents: shared project rules for Codex and Claude Code.
- Learning record: each completed phase gets a reproducible Markdown guide.

## Development

The app was generated with Angular CLI 22.2.3 and uses pnpm only (see `docs/learning/phase-02-angular-project-anatomy.md`).

```powershell
pnpm install   # install dependencies
pnpm start     # dev server at http://localhost:4200/
pnpm test      # unit tests (Vitest)
pnpm build     # production build into dist/
```

## Before implementation

1. Read `AGENTS.md` or `CLAUDE.md`, depending on your agent.
2. Read `docs/product-vision.md`.
3. Read `docs/learning/PHASE-WORKFLOW.md`.
4. Check Angular's official compatibility table: https://angular.dev/reference/versions
5. Confirm the currently stable PrimeNG version and its official installation guide before installing.

## Planned learning site capabilities

- Learning roadmap and phase index
- Lesson detail pages with goals, prerequisites, reading, videos, commands, exercises, expected results, troubleshooting, and review
- Arabic/English language switching
- RTL/LTR layout switching with language
- Code examples and copy buttons
- Progress tracking (local browser storage only if explicitly added later; JSON remains the source for lesson content)
- Search and filtering by topic, difficulty, and status

## Important scope rule

Do not add a backend, database, authentication, cloud persistence, Nx, or Module Federation unless the owner explicitly approves a later phase. Start with a straightforward Angular application.
