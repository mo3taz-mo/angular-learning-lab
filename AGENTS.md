# Repository instructions for AI coding agents

## Mission
Build Angular Learning Lab: a production-minded, bilingual educational website that documents a real Angular learning journey and lets other people reproduce each phase.

## Non-negotiable requirements
- Use the latest stable Angular version that is officially compatible with the selected Node.js and TypeScript versions. Verify official docs before version-sensitive changes; never guess.
- Use pnpm as the only package manager. Do not create or commit `package-lock.json`, `yarn.lock`, or other competing lockfiles.
- Use Angular Material and the CDK (MIT) as the UI library, at the same version as `@angular/core`; verify the official Material guides before version-sensitive changes. Do not add PrimeNG: PrimeNG 22 is under the PrimeUI License (license key), which does not fit a public, reproducible repository (owner decision, 2026-10-21).
- Lesson and roadmap content is supplied by the owner as Markdown (`.md`) files containing lesson and learn sections, and the app must pick up new or changed files without code changes. The exact file format is agreed with the owner in the content-pipeline phase; do not invent it. No backend or database.
- Support Arabic and English from the beginning.
- Arabic must use RTL layout and English LTR layout. Avoid hardcoded left/right layout assumptions; prefer logical CSS properties such as `margin-inline-start`.
- Use standalone Angular components and modern Angular APIs supported by the selected release.
- Keep code accessible, responsive, typed, and testable.
- Each completed learning phase must include a reproducible Markdown guide under `docs/learning/`.
- Do not claim commands/tests passed unless they were actually run and their results are known.

## Workflow
1. Inspect the existing repository before changing anything.
2. State the intended small plan and the files expected to change.
3. Implement the smallest coherent step; do not jump ahead to future phases.
4. Run relevant checks (format/lint/test/build when available).
5. Report exactly what changed, commands executed, results, and any remaining work.
6. Update the relevant phase guide and progress log for each completed phase.

## Architecture boundaries
- Begin with one Angular application; do not introduce Nx, micro-frontends, or Module Federation without explicit approval.
- Keep lesson data, UI components, and application services separated.
- Content files are data, not executable code. Validate their shape with TypeScript interfaces/types, handle missing or malformed content gracefully, and sanitize any rendered Markdown/HTML.
- Do not store secrets or personal/sensitive data in the repository.
- Prefer Angular-native features before adding dependencies.

## Angular conventions
- Prefer standalone components.
- Prefer `inject()` where it improves clarity.
- Use signals for local synchronous UI state when appropriate.
- Use RxJS for streams and asynchronous composition where it is the better fit.
- Use `ChangeDetectionStrategy.OnPush` where appropriate and supported.
- Use `@if`, `@for`, and `@switch` for modern template control flow when appropriate.
- Avoid nested subscriptions and unhandled promises.
- Use lifecycle cleanup APIs such as `takeUntilDestroyed()` when needed.
- Avoid unnecessary abstractions and premature generic frameworks.

## UI and accessibility
- Import Angular Material components only where needed, as standalone imports.
- Theme with the Material 3 `mat.theme` Sass mixin in `src/styles.scss`; use `--mat-sys-*` tokens, not hardcoded colors. Use system fonts and text labels; do not add external font or icon requests.
- Set document language and direction consistently when switching locales (`I18nService` sets `lang` and `dir`; the `[dir]` directive on the app root keeps CDK `Directionality` in step for overlays). UI strings live in the typed English/Arabic dictionaries under `src/app/i18n/`.
- Language and theme choices may be stored in browser local storage (always inside try/catch, with a working fallback).
- Keyboard navigation, visible focus, semantic HTML, accessible names, and readable contrast are required.
- Verify RTL visually; changing `dir` alone may not fix hardcoded directional CSS.

## Documentation
Every phase guide should include:
- Goal and prerequisites
- Tools/versions checked
- Official reading links and optional videos
- Exact commands in execution order
- What each command does and why it is needed
- Files created/changed
- Expected output and verification steps
- Exercises and review questions
- Common errors and solutions
- Completion checklist
- Known limitations and next phase

## Safety and dependency management
- Do not run destructive commands or remove user files without asking.
- Do not upgrade all dependencies opportunistically.
- Do not use `--force` or `--legacy-peer-deps` to hide compatibility issues without explaining the risk and obtaining approval.
- For version-sensitive decisions, cite the official source in the response or documentation.
