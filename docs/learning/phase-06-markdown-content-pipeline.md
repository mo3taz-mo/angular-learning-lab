# Phase 06 — Markdown Content Pipeline

> Status: steps executed by the agent on 2026-10-21, approved by the learner on 2026-10-21. "Actual result" lines are what happened; nothing is claimed beyond what was run.

## Goal
Make the app content-driven: the owner drops Markdown files into `docs/content` and the roadmap, phase pages and their Learn and Lesson sections update with no code changes, in Arabic and English.

## Decisions (agreed with the owner, 2026-10-21)
| Question | Decision |
|---|---|
| How are Learn and Lesson marked? | `## Learn` and `## Lesson` heading markers inside each file |
| Where do title, order, status and summary live? | A front matter block at the top of each file |
| How are Arabic and English stored? | One file per language, `<id>.<en\|ar>.md`; English is shown, with a notice, when a language has no file |
| How is content loaded? | A build-time script converts the files to JSON; the browser downloads no Markdown parser |
| New dependencies | `markdown-it` 15.0.3 (MIT) and `yaml` 2.9.1 (ISC), as `devDependencies` only; no separate HTML sanitizer |

Two details differ slightly from what was first described: the phase `id` and the language come from the **file name** only (so they cannot disagree with a front matter copy), and the front matter fields are therefore `title`, `summary`, `order` and `status`.

## Boundaries (what this phase does not do)
- No search or filtering of lesson text, no copy buttons for code, no in-page table of contents (the data for one is generated; the interface is Phase 07).
- No progress tracking: task-list checkboxes in the content are read-only.
- The owner's wording in the content is not edited.

## Prerequisites
- [x] Phase 05 approved by the learner (2026-10-21)
- [x] The owner's first content file (`docs/content/phase-00-environment-and-repository`)

## Versions checked
| Package | Version | Source | Checked on |
|---|---|---|---|
| `markdown-it` | 15.0.3 (MIT; its 15.0.x changelog lists only denial-of-service-on-crafted-input fixes, no XSS) | npm registry, project changelog | 2026-10-21 |
| `yaml` | 2.9.1 (ISC) | npm registry | 2026-10-21 |
| `httpResource` (Angular) | stable since v22.0 | https://angular.dev/api/common/http/httpResource | 2026-10-21 |

## Learn — Read and watch
- [HTTP resource](https://angular.dev/guide/http/http-resource) — `httpResource`, its signals (`value`, `hasValue`, `isLoading`, `error`) and testing with `HttpTestingController`.
- [Route `canMatch`, `redirectTo` functions and route data](https://angular.dev/guide/routing/define-routes) — how the section routes are matched.
- [markdown-it](https://github.com/markdown-it/markdown-it) — the `html` option and link validation used for safety.

Optional videos: not needed.

## The format (summary; the authoring rules are in `docs/content/README.md`)
```markdown
---
title: Environment and Repository Preparation
summary: Shown on the roadmap card.
order: 0
status: done
---

Optional intro, shown above the tabs.

## Learn
...
## Lesson
...
```

## Practice — Steps

### Step 1: Read the owner's file and agree the format
**Actual result:** The file had no front matter and no Learn/Lesson headings. Four questions were asked and answered (see Decisions). The owner's text mentions PrimeNG and JSON, which no longer match the project; the text was not changed.

### Step 2: Prepare the owner's file for the format
**What changed (structure only, wording untouched):** the file was renamed to `phase-00-environment-and-repository.en.md`; a front matter block was added (`status: done`, because Phase 00 is approved); `## Learn` was inserted before "2. Project rules", `## Lesson` before "4. Step 1 — Open a terminal", and `## Learn` again before "Official references". "1. What you will complete" stays in the intro. A copy of the original file was kept outside the repository.

### Step 3: Install the build-script dependencies
```powershell
pnpm add -D "markdown-it@15.0.3" "yaml@2.9.1"
```
**Actual result:** installed as `devDependencies`; `pnpm-lock.yaml` is still the only lockfile; no build scripts needed approval.

### Step 4: Write the build script
**Code:** `scripts/build-content.mjs` (command line, `--watch`), `scripts/content/build.mjs` (file names, front matter, cross-file checks, output) and `scripts/content/markdown.mjs` (rendering and sections).
**Behavior:**
- File name must match `<id>.<language>.md`; `README.md`, files starting with `_` or `.`, and non-`.md` files are ignored; subfolders are reported as problems.
- Front matter fields are required and checked (`title`, `summary`, `order` whole number, `status` one of `done`, `in-progress`, `planned`); unknown fields are rejected.
- The same phase in two languages must agree on `order` and `status`; two phases cannot share an `order`.
- Body: intro, then `## Learn` and `## Lesson` markers (case-insensitive, repeatable). Other headings are kept. A leading `# Title` is dropped; any other `#` heading is an error.
- Rendering: raw HTML is disabled, dangerous links are rejected, code blocks are `dir="ltr"` and escaped, tables get a focusable scrolling wrapper, task lists become disabled checkboxes, headings get unique ids (Arabic letters allowed).
- Output (deterministic, no timestamps) in `public/content/`: `index.json` and `<id>.<lang>.json`; stale files are removed. If any file is invalid, **nothing is published** and every problem is listed with its file name and a hint.
**Actual result:** the owner's file builds into an intro, a Learn section, a Lesson section and a table of contents.

### Step 5: Test the script
```powershell
pnpm test:content
```
**What is tested (26 tests, Node's built-in runner):** file names, front matter (including CRLF and a BOM), every field problem reported at once, sections, repeated markers, the leading H1, duplicate and Arabic heading ids, raw HTML shown as text, `javascript:`/`vbscript:`/`data:` links not becoming links, code fence injection, table wrapper, task lists, ordered output, removal of stale output, problems across files, language mismatches, and that the real `docs/content` builds.
**Actual result:** 26 passed. Two real bugs were found by these tests and fixed: a duplicated `task-list` class, and a message that listed languages in file-system order.

### Step 6: Wire the script into the commands
`package.json`: `pnpm start`, `pnpm build` and `pnpm test` run the content build first; new `pnpm content`, `pnpm content:watch` and `pnpm test:content`. `public/content/` is in `.gitignore` (generated).

### Step 7: Load the content in the app
**Code (`src/app/content/`):** `content.model.ts` (shapes of the JSON), `ContentService` (`httpResource` for the index and for a phase document; `languageFor`, `title`, `summary`, `textLanguage`, `isFallback`), `RenderedContent` (shows the generated HTML), `provideHttpClient(withFetch())` in `app.config.ts`.
**Language handling:** the document reloads when the language changes; when a phase has no file in the active language the English one is loaded, a notice is shown, and the text carries `lang="en" dir="ltr"` so punctuation, alignment and screen-reader pronunciation are correct inside the Arabic page.
**Safety:** `RenderedContent` bypasses Angular's HTML sanitizer, because the sanitizer would strip heading ids, `dir`, checkboxes and `tabindex`. The HTML is not user input: it is the script's own output from repository files, with raw HTML disabled and dangerous links rejected, and the script tests check both. The component documents this and must not receive any other HTML.

### Step 8: Phase and lesson pages
**Routes:** `roadmap` (list), `roadmap/:phaseId` (redirects to `learn`), `roadmap/:phaseId/:section` for `learn` and `lesson` only (a `canMatch` guard; anything else is the not-found page). One route serves both sections, so switching tabs reuses the page instead of recreating and reloading it.
**Page:** title, summary, status, language notice, intro, and a Material tab bar (Learn, Lesson) that links to the two addresses, with the section content below. Loading, error, "no content yet" and "phase not found" states are handled. Page titles follow the language and the loaded roadmap (`<title> - <section> | <site>`).
**Focus:** clicking a section tab keeps focus on the tab; every other navigation still moves focus to the main content.
**Removed:** the temporary in-code phase data and the placeholder lesson page.

### Step 9: Tests, build and checks
**Actual result:**
- Script tests: 26 passed.
- App tests (`pnpm test --watch=false`): 8 files, 73 tests passed. They cover the service (loading, fallback, reload on language change, errors, no request for unknown ids), the renderer, the cards and list in both languages, every route, the tab switch without a new request, error and empty states, the fallback notice, and the focus rule.
- Prettier passes for every file written or changed in this phase.
- `pnpm build` succeeds: initial total about 442 kB raw / 112 kB transferred (under the 500 kB budget warning).

### Step 10: Check it in a browser
**Actual result (agent, Chrome, a dev server on port 4300 that was then stopped, using the owner's real Phase 00 file):**
- The roadmap showed one card from the file; the phase page redirected to `/learn` and showed the title, the goal callout, the intro, the Learn content (rules list, version table) and a tab bar.
- The Lesson tab went to `/lesson`, showed the steps and code blocks, `aria-selected` and the tab title changed.
- Arabic: the UI flipped to RTL, the notice said the page is not available in Arabic yet, and the English content was left-aligned LTR with correct punctuation after a fix found during this check; the content and heading then lined up at the same edge after a second fix.
- At a 390px width (measured in a frame): no horizontal overflow on the Learn or Lesson page, code blocks and the table fit, the checklists showed 12 checkboxes.
- Not verified: the final code-block and checklist appearance on screen (the browser stopped producing screenshots late in the session, so the last checks were measurements), dark mode and Arabic-file content (there is no Arabic file yet), Firefox and Safari, real devices, a screen reader, and the production build on a web server.

## Files created or changed
Created: `scripts/` (build script, modules, tests), `src/app/content/` (model, service, renderer, test helpers, specs), `docs/content/README.md`, this guide.
Changed: `package.json`, `pnpm-lock.yaml`, `.gitignore`, `src/app/app.ts`, `app.config.ts`, `app.routes.ts` and specs, `src/app/pages/*`, `src/app/phases/*`, `src/app/i18n/*` (dictionaries, title strategy, language types), the project documents (`AGENTS.md`, `README.md`) and the skills (`local-json-content` is now `markdown-content`, in `ai/skills/`, `.agents/skills/`, `.claude/skills/`).
Content: `docs/content/phase-00-environment-and-repository.md` became `phase-00-environment-and-repository.en.md` (structure only).
Deleted: `src/app/phases/phase.model.ts`, `src/app/phases/phases.data.ts`, `src/app/pages/lesson-page/`.

## Exercises
1. Guided: copy the Phase 00 file to `phase-01-typescript-refresh.en.md`, change the front matter (`order: 1`, `status: planned`) and delete the body. Run `pnpm content` and see the new card.
2. Independent: add `phase-00-environment-and-repository.ar.md` with an Arabic title, summary and a short Learn section. Check that the Arabic page no longer shows the fallback notice.
3. Challenge: break a file on purpose (a missing `order`, a second `# heading`, a duplicate `order`) and read each error message. Which ones does the script report together?

## Review questions
1. Why does the build script publish nothing when any file is invalid?
2. Why is raw HTML disabled, and why is it acceptable for `RenderedContent` to bypass Angular's sanitizer?
3. Why do the Learn and Lesson sections share one route entry?
4. Why must English text shown inside an Arabic page carry `lang="en"` and `dir="ltr"`?
5. Why can't `ApplicationRef.whenStable()` be used in a test while another request may still start?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| `pnpm start` stops with "Content problems" | A content file is invalid | Read the listed file names and hints, fix, run again (`pnpm content` is a quick check) |
| A new file does not appear | Wrong name (`.md` without `.en`/`.ar`), name starts with `_` or `.`, or the dev server was started before the file was added | Use `<id>.<language>.md`; run `pnpm content:watch` in a second terminal while editing |
| A phase shows English in Arabic mode | No `.ar.md` file for that phase | Add one; the notice disappears |
| Roadmap order is wrong | `order` values | Set unique whole numbers |
| Both tabs say "This section has no content yet" | The file has no `## Learn` / `## Lesson` markers | Add the markers (written in English) |
| Test hangs in `whenStable()` | A request is still open in the fake backend | Answer it with `respond(...)` or use `settle()` |

## Completion checklist
- [x] Read the specified material (agent read the sources while preparing; the learner has not confirmed reading them)
- [x] Ran the commands (agent-run)
- [x] Verified the expected results (script and app tests, build, browser checks listed above)
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] Owner decision on the Phase 00 wording (it still mentions PrimeNG and JSON)
- [x] User approved the next phase (Phase 06 approved by the learner on 2026-10-21)

## Known limitations
- Content is read at build/start time: editing a file needs `pnpm content` (or `pnpm content:watch` running next to `pnpm start`) before the site shows it.
- Only English files exist (Phase 00 and Phase 01, added by the owner after this phase); Arabic text falls back to English. Planned phases need a front-matter-only file to appear.
- Task-list checkboxes are read-only; the table of contents data is generated but not shown yet.
- Subfolders in `docs/content` are not supported.
- The phase `id` is the file name, so renaming a file changes its address.
- Late browser screenshots failed (the browser extension stopped capturing), so the last visual checks were measurements; a final visual check by the learner is recommended.
- Phase 01's file needed the same structure-only edits as Phase 00 (rename to `.en.md`, front matter, markers, extra `#` headings demoted to `##`); the pipeline allows one `#` heading per file.

## Summary and next phase
The roadmap, phase pages and their Learn and Lesson sections now come entirely from Markdown files in `docs/content`, validated and rendered safely at build time, loaded with `httpResource`, shown in Arabic or English with a fallback, and covered by 26 script tests and 73 app tests. Approved by the learner on 2026-10-21. Proposed next phase: Phase 07, lesson reading features (in-page table of contents, search and filtering, code copy buttons). Not started.
