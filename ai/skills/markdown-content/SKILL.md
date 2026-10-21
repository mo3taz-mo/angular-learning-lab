---
name: markdown-content
description: Work on the Markdown content pipeline: owner-supplied lesson files in docs/content, the build script that validates and renders them, and the app code that loads them safely, in Arabic and English.
---

# Markdown Content Skill

The owner supplies lesson and roadmap content as Markdown files in `docs/content`. The app must show
new or changed files with no code changes. The authoring rules are in `docs/content/README.md`;
keep that file, the build script and this skill consistent.

How it works:
- `scripts/build-content.mjs` (and `scripts/content/*.mjs`) reads `docs/content/<id>.<lang>.md`, checks the front matter (`title`, `summary`, `order`, `status`) and the sections (`## Learn`, `## Lesson`), renders Markdown to HTML, and writes `public/content/index.json` and `public/content/<id>.<lang>.json`. `public/content/` is generated and git-ignored. `pnpm start`, `pnpm build` and `pnpm test` run the script first.
- `ContentService` (`src/app/content/`) loads the index and per-phase documents with `httpResource`, and falls back to English when a language has no file. Text shown in a fallback language must carry its own `lang` and `dir`.
- `RenderedContent` shows the generated HTML.

Rules:
1. Never invent or change the content format without the owner. Ask for a sample file first. Do not edit the owner's content files except for structure the owner asked for, and say exactly what changed.
2. Validate at build time and report every problem with the file name and a fix hint. Publish nothing if any file is invalid.
3. Raw HTML in Markdown stays disabled (`html: false`) and dangerous link schemes stay rejected. `RenderedContent` bypasses Angular's sanitizer only because its input is this script's output; never pass other HTML to it. Changes to the renderer need tests in `scripts/content/content.test.mjs` for raw HTML, `javascript:` links and code fences.
4. Keep generated JSON deterministic (no timestamps) so rebuilds do not trigger needless reloads.
5. Code blocks are always left-to-right; everything else follows the page direction and uses logical CSS properties.
6. Keep content separate from UI components, and UI strings in the typed dictionaries, not in Markdown.
7. Do not add a backend, database, or runtime Markdown parser without the owner's approval. New dependencies need the owner's approval, license and version checks, and `devDependencies` only when they are build-script-only.
8. Test the behavior: script tests (`pnpm test:content`), service and route tests with `HttpTestingController` (see `content.testing.ts`), and a check in the browser in both languages. `ApplicationRef.whenStable()` waits for every in-flight request, so answer requests explicitly in tests.
