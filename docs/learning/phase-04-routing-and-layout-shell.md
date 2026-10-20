# Phase 04 — Routing and Layout Shell

> Status: steps executed by the agent on 2026-10-20, awaiting learner review and approval. "Actual result" lines are what happened; nothing here is claimed beyond what was run.

## Goal
Turn the single page into a small multi-page app: a shared layout (header, navigation, main region) and routes for Home, Roadmap, Phase details, Lesson details and a not-found page, with lazy-loaded pages, route parameters bound to component inputs, page titles, and basic keyboard/screen-reader support.

## Boundaries (what this phase does not do)
- No JSON loading (Phase 05), no PrimeNG (Phase 06), no Arabic/English or RTL switching (Phase 07).
- Resources and About pages from the product vision are not added yet.
- Lesson pages are placeholders; lesson data arrives in Phase 05.

## Prerequisites
- [x] Phase 03 approved by the learner (2026-10-20)
- [x] `pnpm test` and `pnpm build` pass

## Versions checked
| Tool/package | Version | Official source | Checked on |
|---|---|---|---|
| Angular (`@angular/router`) | 22.2.3 | https://angular.dev/reference/versions | 2026-10-20 |

## Learn — Read and watch
### Official documentation
- [Define routes](https://angular.dev/guide/routing/define-routes) — `Routes`, `:param` segments, `**` wildcard, `title`.
- [Route loading strategies](https://angular.dev/guide/routing/loading-strategies) — `loadComponent` with dynamic `import()`.
- [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes) — `RouterLink`, including the array form with parameters.
- [`withComponentInputBinding`](https://angular.dev/api/router/withComponentInputBinding) — route parameters become component inputs.
- [`RouterLinkActive`](https://angular.dev/api/router/RouterLinkActive) — `routerLinkActive`, `routerLinkActiveOptions`, `ariaCurrentWhenActive`.

### Optional videos
Not needed; the official pages and running the app are enough for this phase.

## Route map
| URL | Page component | Title |
|---|---|---|
| `/` | `HomePage` | Home \| Angular Learning Lab |
| `/roadmap` | `RoadmapPage` | Learning roadmap \| Angular Learning Lab |
| `/roadmap/:phaseId` | `PhasePage` | `<phase title>` \| Angular Learning Lab (title resolver) |
| `/roadmap/:phaseId/lessons/:lessonId` | `LessonPage` | Lesson: `<lessonId>` \| Angular Learning Lab |
| anything else (`**`) | `NotFoundPage` | Page not found \| Angular Learning Lab |

The routes are flat on purpose (no parent/child nesting) to keep the first routing phase simple. The wildcard route must stay last.

## Practice — Steps

### Step 1: Create the page components
**Why:** Each route renders one page component. Pages live in `src/app/pages/` and are separate from the reusable phase components in `src/app/phases/`.
**What it does:** Creates `home-page`, `roadmap-page`, `phase-page`, `lesson-page` and `not-found-page` (class + template; `lesson-page` also has a stylesheet for the breadcrumb). The agent wrote the files directly; `ng generate component pages/home-page` produces the same structure.
**Actual result:** 5 page components created. All use `ChangeDetectionStrategy.OnPush` and standalone components.

### Step 2: Define the routes with lazy loading
**Why:** `loadComponent` loads a page's code only when its route is visited, which keeps the first download small.
**Code:** `src/app/app.routes.ts` — each route has `loadComponent: () => import('./pages/…').then((m) => m.SomePage)`. The `.then` selects the named export; the docs show the shorter form only for default exports.
**Titles:** Static routes use a `title` string. The phase and lesson routes use a resolver function (`ResolveFn<string>`) that reads the route parameters, so the browser tab title changes with the page.
**Actual result:** `pnpm build` produced one lazy chunk per page (roadmap 4.69 kB, lesson 1.60 kB, phase 1.40 kB, home 0.58 kB, not-found 0.49 kB raw) and an initial bundle of 229.43 kB raw / 63.44 kB transfer.

### Step 3: Turn on component input binding
**Why:** With `withComponentInputBinding()`, a `:phaseId` path parameter is delivered to a component input named `phaseId`, so pages need no `ActivatedRoute` code.
**Code:** `src/app/app.config.ts`: `provideRouter(routes, withComponentInputBinding())`. In the pages: `readonly phaseId = input.required<string>();` and a `computed()` that looks up the phase.
**Note:** The binding is by name; the input must have the same name as the route parameter. If a key is missing the input becomes `undefined` (per the API docs).

### Step 4: Build the layout shell
**Why:** The header and navigation appear on every page; only the content inside `<router-outlet />` changes.
**Code:** `src/app/app.html` has a skip link, a header (site name link plus `<nav aria-label="Main">`), and `<main id="main-content" tabindex="-1">` containing `<router-outlet />`.
- `routerLink` creates links the router handles without a page reload.
- `routerLinkActive="is-active"` adds a class on the active link; the Home link uses `{ exact: true }` so it is not active on every page.
- `ariaCurrentWhenActive="page"` sets `aria-current="page"` so assistive technology also knows the current page.
- The site name is now a link, not an `<h1>`: each page has its own single `<h1>`.

### Step 5: Add keyboard and screen-reader support
**Why:** After a client-side navigation the browser does not reload, so focus stays on the clicked link and screen-reader users get no cue that the page changed.
**Code:** `src/app/app.ts` listens to router `NavigationEnd` events (skipping the first, the initial page load) and focuses `<main>`. The skip link focuses `<main>` too; it uses `preventDefault()` because a plain `href="#main-content"` would be handled by the router as a navigation. The `main` element has `tabindex="-1"` so code can focus it, and no visible outline because it is not interactive.
**Limitation:** Focus moves, but no live-region announcement of the new page title is made (that would need an announcer; deferred).

### Step 6: Link the cards to the phase pages
**Why:** The roadmap should lead somewhere. `PhaseCard`'s title is now `<a [routerLink]="['/roadmap', current.id]">`. Global styles give links the accent color.
**Also:** `PHASE_STATUS_LABELS` (model) and `findPhase()` (data file) were added. `findPhase()` is temporary; Phase 05 replaces it with data loaded from JSON.

### Step 7: Write the tests
**Why:** Routing bugs are easy to introduce and easy to test.
- `app.routes.spec.ts` uses `RouterTestingHarness` to navigate to each URL and checks the heading and the document title: home, roadmap, an existing phase, an unknown phase, a lesson, an unknown phase on the lesson route, an unknown URL, and a click on a card link.
- `app.spec.ts` checks the shell: site name, skip link, the two nav links, `aria-current` on the current link, focus moving to `<main>` after navigation but not on the first navigation, and the skip link focusing `<main>`.
- `phase-card.spec.ts` and `phase-list.spec.ts` now provide a router (`provideRouter([])`) because the cards contain links; one new test checks the link target.

### Step 8: Run formatting, tests, build
```powershell
pnpm exec prettier --check <files changed in this phase>
pnpm test --watch=false
pnpm build
```
**Actual result:**
- Prettier: all files written or changed in this phase pass (the four CLI-generated files from Phase 02 that were already flagged were not touched, except `app.config.ts`, which was rewritten and now passes).
- `pnpm test --watch=false`: 4 test files, 21 tests passed, exit code 0.
- `pnpm build`: succeeded, exit code 0.

### Step 9: Look at it in a browser
```powershell
pnpm start
```
**Actual result (agent, Chrome, light mode; against a dev server already running on port 4200):**
- Opening `/roadmap/phase-03/lessons/overview` directly (a deep link) rendered the lesson page with the breadcrumb and `Roadmap` marked active; the tab title was "Lesson: overview | Angular Learning Lab".
- `/no/such/page` showed "Page not found" with a link home.
- Pressing Tab on the home page revealed the "Skip to main content" link.
- Clicking the "TypeScript refresh" card went to `/roadmap/phase-01` with no page reload, the title changed to "TypeScript refresh | Angular Learning Lab", and the focused element was `<main id="main-content">`.
- No console errors or warnings were reported.
- Not checked: dark mode, small screens, a screen reader, the production build served over a real web server.

## Files created or changed
Created:
- `src/app/pages/{home-page,roadmap-page,phase-page,lesson-page,not-found-page}/` (`.ts` and `.html` each; `lesson-page.css`)
- `src/app/app.routes.spec.ts`
- `docs/learning/phase-04-routing-and-layout-shell.md`

Changed:
- `src/app/app.routes.ts`, `src/app/app.config.ts`
- `src/app/app.ts`, `app.html`, `app.css`, `app.spec.ts`
- `src/app/phases/phase.model.ts`, `phases.data.ts`
- `src/app/phases/phase-card/phase-card.{ts,html,spec.ts}`, `phase-list/phase-list.spec.ts`
- `src/styles.css` (link color)
- `docs/learning/phase-03-components-templates-control-flow.md` (approval ticked)

## Exercises
1. Guided: add a new route `/about` with an `AboutPage` component and a nav link. Check that the link gets `aria-current` only on that page.
2. Independent: change `phase-page` to also show the previous and next phase as links, computed from `PHASES`.
3. Challenge: replace the two title resolver functions with a custom `TitleStrategy` that appends " | Angular Learning Lab" automatically, so routes only declare short titles.

## Review questions
1. Why is a plain `<a href="#main-content">` a problem in a single-page app with a `<base href="/">`?
2. What does `withComponentInputBinding()` change for a page component, and what must match?
3. Why does the Home link need `{ exact: true }` and the Roadmap link does not?
4. Why must the `**` route be last?
5. What does lazy loading with `loadComponent` change in the build output?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| A page opens but its `phaseId` input is empty | Input name does not match the `:phaseId` parameter, or `withComponentInputBinding()` is missing | Match the names; add the feature to `provideRouter` |
| Tests fail with a missing `Router` / `ActivatedRoute` provider | A component with `routerLink` is tested without a router | Add `provideRouter([])` to the test providers |
| Home link always shows as active | Missing `{ exact: true }` | Add `[routerLinkActiveOptions]="{ exact: true }"` |
| Skip link navigates to `/` | Router handles the `#` link | Prevent the default and focus the element in code |
| Direct URL works with `ng serve` but 404s on a static host | The host does not fall back to `index.html` | Configure the host's SPA fallback when deploying (not done in this phase) |
| Second `ng serve` fails with "Port 4200 is already in use" | A dev server is already running | Reuse it, or pass a different `--port` |

## Completion checklist
- [x] Read the specified material (agent read the official pages while preparing; the learner has not confirmed reading them)
- [x] Ran the commands (agent-run)
- [x] Verified the expected results (tests, build, browser behavior in light mode)
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] User approved the next phase

## Known limitations
- All text is hardcoded English; RTL/LTR and the language switcher are Phase 07. Layout CSS uses logical properties but RTL has not been checked visually.
- Page changes move focus but are not announced by a live region.
- Phase data and `findPhase()` are in code, not JSON (Phase 05); the lesson link on a phase page is a placeholder.
- No Resources or About page yet.
- Dark mode, small-screen layout and screen-reader behavior were not checked.
- The production build was not tested on a web server with SPA fallback.
- Nothing from this phase is committed or pushed yet.

## Summary and next phase
The app now has a layout shell and five routes, with lazy-loaded pages, route parameters bound to inputs, per-page titles, an accessible skip link, current-page marking, and focus management after navigation, covered by 21 passing tests. Awaiting the learner's review. Proposed next phase: Phase 05, local JSON content and typed models. Not started.
