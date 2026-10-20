# Phase 03 — Components, Templates and Control Flow

> Status: steps executed by the agent on 2026-10-20, awaiting learner review and approval. "Expected" describes the plan; "Actual result" is what happened.

## Goal
Build the first real piece of the product: a roadmap list of phase cards with a status filter, using standalone components, signal inputs, signals, `computed()`, and the `@for` / `@if`-style template control flow, with unit tests.

## Boundaries (what this phase does not do)
- No routing (Phase 04), no JSON loading (Phase 05), no PrimeNG (Phase 06), no Arabic/English or RTL switching (Phase 07).
- Phase data lives in a TypeScript file for now and is replaced by local JSON in Phase 05.

## Prerequisites
- [x] Phase 02 done (app created; the learner asked to start Phase 03, which was taken as approval of Phase 02)
- [x] `pnpm test`, `pnpm build` and `pnpm start` work

## Versions checked
| Tool/package | Version | Official source | Checked on |
|---|---|---|---|
| Angular | 22.2.3 | https://angular.dev/reference/versions | 2026-10-20 |
| TypeScript | 6.0.3 | npm peer range of `@angular/compiler-cli` | 2026-10-20 |
| Vitest | 5.0.5 | npm registry | 2026-10-20 |

## Learn — Read and watch
### Official documentation
- [Components](https://angular.dev/guide/components) — standalone components, `selector`, `templateUrl`, `styleUrl`, the `imports` array.
- [Control flow](https://angular.dev/guide/templates/control-flow) — `@if`, `@for` (with required `track`, `@empty`), `@switch`.
- [Signal inputs](https://angular.dev/guide/components/inputs) — `input()`, `input.required<T>()`, binding with `[name]`.
- [Signals](https://angular.dev/guide/signals) — `signal()`, `set()`, `update()`, `computed()`.

### Optional videos
Not needed; the official pages plus running the code are enough for this phase.

## Practice — Steps

### Step 1: Generate the two components
**Why:** The CLI creates the component class, template, stylesheet and spec file in the project's file-naming style (`phase-card.ts`, not `phase-card.component.ts`).
```powershell
ng generate component phases/phase-card --display-block
ng generate component phases/phase-list --display-block
```
**What it changes:** Creates 4 files per component under `src/app/phases/`. `--display-block` adds `:host { display: block; }` to the stylesheet.
**Expected result:** 8 files created.
**Actual result:** 8 files created. The generated class had no `changeDetection` line; the code below adds `ChangeDetectionStrategy.OnPush` explicitly so it is visible. (`ng generate component --help` lists `OnPush` as the schematic's default.)
**Troubleshooting:** If `ng` is not found, see Phase 00 (`pnpm setup`, restart terminals).

### Step 2: Define the data model and sample data
**Why:** Components are easier to build and test against a typed model than against loose objects.
**Code:** `src/app/phases/phase.model.ts` defines `PhaseStatus` (`'done' | 'in-progress' | 'planned'`), `PhaseFilter` (`PhaseStatus | 'all'`) and the `Phase` interface. `src/app/phases/phases.data.ts` exports a `PHASES` array of six phases (temporary; replaced in Phase 05).
**Verification:** TypeScript rejects any phase whose `status` is not one of the three values.

### Step 3: Build `PhaseCard`
**Why:** A presentational component that only receives data is the simplest reusable unit.
**Code:** `phase-card.ts` declares `readonly phase = input.required<Phase>()`. The template uses `@let current = phase();`, then `@switch (status)` with a text label for each status and `@default never;`.
**Concepts:**
- `input.required<Phase>()`: the build fails if a parent forgets `[phase]`.
- Signal inputs are read by calling them: `phase()`.
- `@let` stores a template value once. It was used on `phase().status` because `@default never;` works on variables, not on function or signal calls (per the control-flow page).
- `@default never;` makes the compiler fail if a status is added to the type without a matching `@case`.
- The status is shown as text, not only as a colored border, so it does not rely on color alone.

### Step 4: Build `PhaseList`
**Why:** A container component owns the state (the selected filter) and passes data down to the cards.
**Code:**
- `phases = input.required<readonly Phase[]>()`
- `filter = signal<PhaseFilter>('all')`
- `visiblePhases = computed(() => ...)` filters `phases()` by `filter()`
- Template: filter buttons built with `@for ... track option.value`, each with `aria-pressed`; the cards built with `@for (phase of visiblePhases(); track phase.id)` and an `@empty` message; a count line with `aria-live="polite"`.
**Concepts:** `computed()` is lazy and cached, and re-runs only when `filter()` or `phases()` change. `track` tells Angular which DOM node belongs to which item.

### Step 5: Use the list in the app shell
**Why:** Components do nothing until a parent places them in a template and lists them in `imports`.
**Code:** `app.ts` imports `PhaseList` and exposes `phases = PHASES`; `app.html` is now a header plus `<app-phase-list [phases]="phases" />`. The CLI welcome page and the unused `RouterOutlet` import were removed (routing starts in Phase 04).

### Step 6: Add base styles
**Why:** One set of theme tokens keeps colors consistent. Component CSS uses logical properties (`padding-inline`, `border-inline-start`, `max-inline-size`, `margin-inline`) so RTL works later without rewrites.
**Code:** `src/styles.css` defines color tokens for light and dark mode (`prefers-color-scheme`), a `:focus-visible` outline, and body defaults.

### Step 7: Write the tests
**Why:** Tests record the expected behavior and catch regressions.
**Code:**
- `phase-card.spec.ts`: title and summary render; each of the three statuses shows the right text and `data-status` (via `it.each`).
- `phase-list.spec.ts`: all phases show by default; clicking "Planned" filters, updates `aria-pressed` and the count; the empty message shows when nothing matches.
- `app.spec.ts`: the site title renders and one card exists per phase.
- Inputs are set in tests with `fixture.componentRef.setInput(...)`, because required inputs cannot be assigned directly.

### Step 8: Run formatting, tests, build
```powershell
pnpm exec prettier --check "src/**/*.{ts,html,css}"
pnpm test --watch=false
pnpm build
```
**Expected result:** All pass.
**Actual result:**
- Prettier: flagged `src/app/app.config.ts`, `app.routes.ts`, `index.html`, `main.ts` (all CLI-generated, left unchanged) and `src/styles.css` (fixed with `prettier --write`). Everything written in this phase passes.
- `pnpm test --watch=false`: 3 files, 10 tests passed, exit code 0.
- `pnpm build`: succeeded; initial total 208.27 kB raw / 57.86 kB transfer; exit code 0.

### Step 9: Look at it in a browser
```powershell
pnpm start
```
Open http://localhost:4200/.
**Actual result (agent, Chrome):** The page rendered the title, the four filter buttons (the selected one highlighted), a "Showing 6 of 6 phases" line, and the cards with a colored start edge and a text status. Clicking "Planned" showed 3 of 6 phases and highlighted that button. No console errors or warnings. Light mode only was viewed; dark mode and keyboard use were not checked in the browser.

## Contrast check (calculated, WCAG 2.x ratios)
| Pair | Ratio |
|---|---|
| Light: text on surface / muted text on surface | 16.24 / 7.69 |
| Light: filter button text (white on accent) | 6.7 |
| Dark: text on surface / muted text on surface | 14.57 / 8.55 |
| Dark: filter button text (dark on accent) | 8.76 |
| Status colors vs surface (light / dark) | 4.68–7.05 / 6.43–9.78 |
| Light: border vs page | 1.58 (see limitations) |

## Files created or changed
Created:
- `src/app/phases/phase.model.ts`, `src/app/phases/phases.data.ts`
- `src/app/phases/phase-card/phase-card.{ts,html,css,spec.ts}`
- `src/app/phases/phase-list/phase-list.{ts,html,css,spec.ts}`

Changed:
- `src/app/app.ts`, `src/app/app.html`, `src/app/app.css`, `src/app/app.spec.ts`, `src/styles.css`
- `angular.json`: `"analytics": false` added (see Common errors)
- `docs/learning/phase-02-angular-project-anatomy.md`: git note and approval

## Exercises
1. Guided: add a fourth status, `'skipped'`, to `PhaseStatus`. Read the compile error that `@default never;` produces in `phase-card.html`, then add the missing `@case`.
2. Independent: show the phase number from `id` on each card, using `$index` or a new field. Add a test.
3. Challenge: make the list show which filter is active in the heading ("Learning phases — Planned"), using only `computed()`.

## Review questions
1. What is the difference between `input()` and `input.required()`, and when does the build fail?
2. Why does `@for` require `track`, and why is `track phase.id` better than `track $index` here?
3. Why is `visiblePhases` a `computed()` rather than a method called in the template?
4. Why does the card show the status as text as well as a colored edge?
5. Why was `@let` needed before `@default never;`?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| Build error about a missing required input | A parent template uses the component without `[phase]` / `[phases]` | Bind the input |
| Test throws when assigning a required input | Inputs are read-only signals | Use `fixture.componentRef.setInput('name', value)` |
| `@default never;` rejected | Used on a function or signal call | Store the value with `@let` first |
| Unused import warning for `RouterOutlet` | Imported in `imports` but not used in the template | Remove it until routing is added |
| `angular.json` gains an `analytics` UUID after `ng generate` | The CLI enabled analytics for the project without asking | Run `ng analytics disable --no-global` (writes `"analytics": false`); check with `ng analytics info` |

## Completion checklist
- [x] Read the specified material (agent read the official pages while preparing; the learner has not confirmed reading them)
- [x] Ran the commands (agent-run)
- [x] Verified the expected results (tests, build, browser view in light mode)
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] User approved the next phase

## Known limitations
- All UI text is hardcoded English. Arabic/English and RTL/LTR are Phase 07; layout CSS already uses logical properties, but RTL has not been verified visually.
- Phase data is in TypeScript, not JSON (Phase 05).
- Dark mode and keyboard navigation were not checked in a browser; contrast ratios were calculated, not measured on screen.
- The unselected filter buttons use a 1.58:1 border against the page, below the 3:1 often used for UI component boundaries. The button text is readable, but consider a darker border in the accessibility pass (Phase 09).
- Prettier still flags four CLI-generated files that were left untouched.
- Nothing from this phase is committed or pushed yet.

## Summary and next phase
The app now shows a filterable roadmap built from two standalone, OnPush components with signal inputs, `signal()`, `computed()`, `@for`/`@empty`, `@switch` and `@let`, covered by 10 passing tests. Awaiting the learner's review. Proposed next phase: Phase 04, routing and layout shell. Not started.
