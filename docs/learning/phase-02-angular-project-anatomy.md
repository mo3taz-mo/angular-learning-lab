# Phase 02 — Create the Angular App and Project Anatomy

> Status: steps executed on 2026-10-20, awaiting learner review and approval. "Expected" lines describe what was planned; "Actual result" lines are what happened.

## Goal
Create the Angular Learning Lab application with pnpm, understand what the CLI generated, and run, test, and build it once.

## Prerequisites
- [x] Phase 00 approved (environment, PATH, compatibility check)
- [ ] Phase 01 (TypeScript refresh) skipped by the learner's choice; may be done later
- [x] `ng`, `node`, `pnpm` resolve in a fresh terminal

## Decisions made for `ng new`
| Option | Choice | Why |
|---|---|---|
| Workspace name | `angular-learning-lab` | Matches the repository folder |
| Package manager | `pnpm` | Project rule: pnpm only |
| Stylesheets | `css` | Simplest; PrimeNG theming uses design tokens, not Sass |
| Routing | on | Product needs Home / Roadmap / Phase / Lesson routes |
| SSR / prerendering | off | No backend; keep the first iteration simple (can be revisited) |
| Zoneless | on | Modern default direction; uses signals-based change detection |
| Unit test runner | `vitest` (CLI default) | Use the CLI default for the selected release |
| AI config files | `none` | Project already has `AGENTS.md` and `CLAUDE.md`; avoid overwriting |
| Git | `--skip-git` | Learner has not asked for a repository or commits yet |
| File naming style | `2025` (CLI default) | Current official Angular style guide |

## Versions checked
| Tool/package | Version | Official source | Checked on |
|---|---|---|---|
| Node.js | 24.15.0 | https://angular.dev/reference/versions | 2026-10-20 |
| Angular CLI (global) | 22.2.3 | https://angular.dev/reference/versions | 2026-10-20 |
| pnpm | 11.9.0 | https://pnpm.io/ | 2026-10-20 |
| `@angular/core` in app | 22.2.3 | npm registry / angular.dev | 2026-10-20 |
| TypeScript in app | 6.0.3 (within `>=6.0 <6.1`; pnpm noted 7.0.2 exists, not used) | npm registry peer range | 2026-10-20 |
| Vitest | 5.0.5 (accepted by `@angular/build` peer `^4.0.8 \|\| ^5.0.0`) | npm registry | 2026-10-20 |

## Learn — Read and watch
### Official documentation
- [Setting up the local environment](https://angular.dev/tools/cli/setup-local) — how `ng new` and `ng serve` are used.
- [Angular workspace file structure](https://angular.dev/reference/configs/file-structure) — what each generated file is for.
- [Angular style guide](https://angular.dev/style-guide) — why the root component is `app.ts`, not `app.component.ts`.

### Optional videos
Not needed; the official docs and running the commands are sufficient for this phase.

## Practice — Steps
### Step 1: Preview the generation (dry run)
**Why:** Shows what `ng new` would do without writing files, and reveals conflicts with existing files.
```powershell
ng new angular-learning-lab --directory . --dry-run --defaults --package-manager pnpm --style css --routing --no-ssr --zoneless --ai-config none --skip-git --skip-install
```
**Expected:** A list of files to create.
**Actual result:** Failed with `A merge conflicted on path "/README.md"` because the project folder already contains `README.md` (and `.gitignore`). Nothing was written.
**Troubleshooting:** Generate in an empty folder, then merge by hand (Step 2).

### Step 2: Generate the app in an empty scratch folder
**Why:** Avoids overwriting the existing `README.md`, `.gitignore`, `AGENTS.md`, `CLAUDE.md` and `docs/`.
```powershell
ng new angular-learning-lab --defaults --package-manager pnpm --style css --routing --no-ssr --zoneless --ai-config none --skip-git --skip-install
```
**Expected:** A new `angular-learning-lab` folder with `package.json`, `angular.json`, `tsconfig*.json`, `src/`, `public/`, `.gitignore`, `README.md`, `.editorconfig`, `.vscode/`.
**Actual result:** Created 22 files (listed under "Files created or changed"). `package.json` came with `"packageManager": "pnpm@11.9.0"`, and `angular.json` with `"cli": { "packageManager": "pnpm" }`. No git repository was created.

### Step 3: Copy the generated files into the project
**Why:** Keeps the existing project files; `README.md` and `.gitignore` are merged manually.
**Command:** Copy everything from the scratch folder except `README.md` and `.gitignore` into the project root, checking first that no file would be overwritten.
**Actual result:** No conflicts; everything copied. `.gitignore` was extended (CLI output folders, VS Code rules, `package-lock.json`, `yarn.lock`). `README.md` got a "Development" section with the pnpm commands.

### Step 4: Install dependencies with pnpm
```powershell
pnpm install
```
**Why:** Creates `node_modules` and `pnpm-lock.yaml`.
**Expected:** Dependencies installed; only `pnpm-lock.yaml` exists as a lockfile.
**Actual result:** Failed the first time, then succeeded after two fixes (see "Common errors"):
1. `ERR_PNPM_NO_MATCHING_VERSION` for `magic-string@^1.4.3` (stale pnpm metadata cache).
2. `ERR_PNPM_IGNORED_BUILDS` for four packages, resolved by approving them.

Installed: `@angular/core` 22.2.3, `@angular/cli` 22.2.3, `typescript` 6.0.3, `rxjs` 7.8.2, `vitest` 5.0.5, `jsdom` 30.1.3, `prettier` 3.9.10. `pnpm-lock.yaml` is the only lockfile.

### Step 4b: Approve the dependency build scripts
```powershell
pnpm approve-builds @parcel/watcher esbuild lmdb msgpackr-extract
```
**Why:** pnpm 11 does not run dependency install scripts until they are approved, and refuses to run `pnpm test`/`pnpm build` while any are pending. These four belong to Angular's build toolchain (bundler, file watcher, build cache) and set up native binaries.
**Actual result:** All four scripts ran and completed. The approval is saved in `pnpm-workspace.yaml` under `allowBuilds`. The learner chose this explicitly (2026-10-20).
**Security note:** Approving a build script lets that package run code on your machine at install time. Only approve packages you recognize.

### Step 5: Run the tests, the build, and the dev server
```powershell
pnpm test --watch=false
pnpm build
pnpm start
```
**Expected:** Tests pass; build writes `dist/`; dev server serves http://localhost:4200/.
**Actual result:**
- `pnpm test --watch=false`: 1 test file, 2 tests passed (Vitest 5.0.5), exit code 0.
- `pnpm build`: succeeded, `main-*.js` 216.88 kB raw / 59.58 kB transfer, output in `dist/angular-learning-lab`, exit code 0.
- `pnpm start`: dev server answered `HTTP 200` at `http://localhost:4200/` with `<title>AngularLearningLab</title>` and `<app-root>`; stopped afterwards, port 4200 free.
- Not done: the page was fetched over HTTP only. It was not opened and viewed in a browser.

## Files created or changed
Created by `ng new` (copied into the project root):
- `package.json`, `pnpm-lock.yaml` (from install), `angular.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.spec.json`
- `.editorconfig`, `.prettierrc`, `.vscode/extensions.json`, `.vscode/launch.json`, `.vscode/tasks.json`
- `public/favicon.ico`
- `src/main.ts`, `src/index.html`, `src/styles.css`
- `src/app/app.ts`, `app.html`, `app.css`, `app.spec.ts`, `app.config.ts`, `app.routes.ts`

Created by pnpm: `pnpm-workspace.yaml` (build-script approvals), `pnpm-lock.yaml`, `node_modules/`, `dist/` (both git-ignored).

Changed by hand: `.gitignore` (extended), `README.md` (Development section).

Outside the project: the pnpm metadata cache file for `magic-string` was renamed to `magic-string.jsonl.stale-bak` under `%LOCALAPPDATA%\pnpm-cache\v11\metadata\registry.npmjs.org\`. It is safe to delete.

## Exercises
1. Guided: open `src/app/app.ts` and change the title signal; confirm the browser updates.
2. Independent: find where the routes array lives and add an empty route.
3. Challenge: explain what `angular.json` `budgets` do and what happens when exceeded.

## Review questions
1. Why does `ng version` show npm as the package manager outside a project?
2. What is the difference between `ng serve` and `ng build`?
3. What does zoneless mean for change detection?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| `A merge conflicted on path "/README.md"` | `ng new --directory .` into a non-empty folder | Generate in an empty folder and copy |
| `ng` not recognized | pnpm global bin not on PATH | Run `pnpm setup`, restart terminals |
| `ERR_PNPM_NO_MATCHING_VERSION ... magic-string@^1.4.3 ... latest release is 1.4.2` | Stale local pnpm metadata cache (written before 1.4.3 was published); `pnpm view` showed 1.4.3 | Move that package's file in `%LOCALAPPDATA%\pnpm-cache\v11\metadata\registry.npmjs.org\` aside and re-run `pnpm install`. No `--force` needed |
| `ERR_PNPM_IGNORED_BUILDS` and `pnpm test`/`pnpm build` fail | pnpm 11 blocks dependency install scripts until approved | Review the listed packages, then `pnpm approve-builds <names>` |
| `Unknown option ""` from `ng serve` | Extra `--` passed through `pnpm start -- --port 4200` | Run `pnpm start` (port 4200 is the default) or `pnpm start --port 4300` |
| Red `NativeCommandError` text in Windows PowerShell 5.1 | PowerShell wraps the CLI's stderr progress output | Ignore it when the exit code (`$LASTEXITCODE`) is 0 |

## Completion checklist
- [ ] Read the specified material
- [x] Ran the commands (agent-run on 2026-10-20; the learner has not re-run them)
- [x] Verified the expected results (tests, build, dev server HTTP 200); browser view still to be checked by the learner
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] User approved the next phase

## Known limitations
- The app is the unmodified CLI starter (`app.html` is the Angular welcome page). No Angular Learning Lab features exist yet.
- Phase 01 (TypeScript refresh) was skipped by choice.
- Not yet viewed in a browser; no git repository has been initialized.
- The commands were run from the agent session, not by the learner.

## Summary and next phase
A zoneless, routed, standalone Angular 22.2.3 app with TypeScript 6.0.3, Vitest and pnpm 11.9.0 now exists at the repository root. Tests pass (2/2), the production build succeeds, and the dev server serves the starter page. Two pnpm 11 behaviours were new: the stale metadata cache and the build-script approval step.

Awaiting the learner's review and approval of Phase 02. Proposed next phase: Phase 03, components, templates and control flow. Not started.
