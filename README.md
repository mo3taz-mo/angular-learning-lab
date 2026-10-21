# Angular Learning Lab

An open, bilingual (Arabic/English) learning platform built alongside a step-by-step Angular learning journey.

## Initial product decisions

- Angular: latest stable release supported by the official compatibility table at implementation time.
- Package manager: pnpm only.
- UI: Angular Material + CDK (MIT), at the same version as Angular. PrimeNG is not used because PrimeNG 22 requires a license key.
- Content: lesson and roadmap content is added as Markdown files (lesson and learn sections) without code changes; no backend. The file format is agreed in the content-pipeline phase.
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
5. Check the official Angular Material guides (https://material.angular.dev/) before changing UI dependencies or theming.

## Planned learning site capabilities

- Learning roadmap and phase index
- Lesson detail pages with goals, prerequisites, reading, videos, commands, exercises, expected results, troubleshooting, and review
- Arabic/English language switching
- RTL/LTR layout switching with language
- Code examples and copy buttons
- Progress tracking (local browser storage only if explicitly added later; Markdown files remain the source for lesson content). Language and theme choices are already remembered in local storage.
- Search and filtering by topic, difficulty, and status

## Important scope rule

Do not add a backend, database, authentication, cloud persistence, Nx, or Module Federation unless the owner explicitly approves a later phase. Start with a straightforward Angular application.
