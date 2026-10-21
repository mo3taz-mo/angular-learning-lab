# Phase 05 — Design, Responsive Layout and Arabic/English (RTL/LTR)

> Status: steps executed by the agent on 2026-10-21, awaiting learner review and approval. "Actual result" lines are what happened; nothing is claimed beyond what was run.

## Goal
Finish the application shell so that content can be added later without more app work: a designed, responsive layout with light and dark themes, and a real Arabic/English switch that flips the whole UI between RTL and LTR.

## Why the plan changed
The original roadmap had "PrimeNG" and "i18n" as separate later phases and "local JSON" as the content source. Two things changed on 2026-10-21:
1. **Content:** the owner will supply Markdown files with lesson and learn sections, so a Markdown content pipeline replaces the JSON phase (now Phase 06).
2. **UI library:** PrimeNG 22.1.2 (the only line compatible with Angular 22.2.x) is under the PrimeUI License, not MIT: a self-service 12-month license key, a possible license notice without one, and the key may not be published. PrimeNG 21 requires Angular 21. The repository is public and meant to be reproducible, so the owner chose **Angular Material + CDK** (MIT, released in step with Angular).

Design, responsive layout and language/RTL were combined into this one phase at the owner's request.

## Boundaries (what this phase does not do)
- No Markdown loading or rendering (Phase 06). Phase data is still temporary in-code data, now bilingual.
- No search, code-copy buttons or real lesson pages (Phase 07).
- No full accessibility audit with a screen reader (Phase 08).

## Prerequisites
- [x] Phase 04 approved by the learner (2026-10-20)
- [x] `pnpm test` and `pnpm build` pass

## Versions checked
| Tool/package | Version | Official source | Checked on |
|---|---|---|---|
| `@angular/material`, `@angular/cdk` | 22.2.3 (same as `@angular/core`; peer range `^22.0.0 \|\| ^23.0.0`) | npm registry, MIT license | 2026-10-21 |
| PrimeNG (not used) | 22.1.2 latest; 21.1.10 needs Angular 21 | npm registry, https://primeui.dev/licenses/community | 2026-10-21 |

## Learn — Read and watch
### Official documentation
The Material docs site is a client-rendered app that could not be fetched as text, so the same guides were read from the official `angular/components` repository (`guides/` directory):
- [Getting started](https://github.com/angular/components/blob/main/guides/getting-started.md) — install; `ng add` adds Google-hosted fonts and an icon font, which this project avoids.
- [Theming (Material 3)](https://github.com/angular/components/blob/main/guides/theming.md) — the `mat.theme` Sass mixin, palettes, typography, density, `color-scheme` and manual dark mode.
- [Bidirectionality](https://github.com/angular/components/blob/main/guides/bidirectionality.md) — `dir`, the CDK `Directionality` service, and its runtime limitation.
- [Angular i18n overview](https://angular.dev/guide/i18n) — background on why built-in compile-time i18n was not used here (it builds one app per language and does not switch at runtime).

### Optional videos
Not needed.

## Design decisions
| Topic | Choice | Why |
|---|---|---|
| UI library | Angular Material + CDK | MIT, version-aligned with Angular 22, built-in RTL, accessible components |
| Install | `pnpm add`, not `ng add` | `ng add` injects Google font/icon links (external requests) |
| Theme | Material 3 `mat.theme`, azure palette, in `src/styles.scss` | Current theming API; Sass is compiled by the Angular build (no extra dependency) |
| Light/dark | `color-scheme` + `data-theme` on `<html>` (light / dark / system) | The Material guide says switching is the app's job; `light-dark()` follows `color-scheme` |
| Fonts | System fonts (`Segoe UI`, Tahoma, `system-ui`) | No external requests; they cover Arabic |
| Icons | None; text labels | No icon font; text works in both languages |
| Translations | Typed dictionaries (`translations.en.ts`, `translations.ar.ts`) + `I18nService` + pipes | Angular-native, no new dependency, runtime switching; a missing Arabic key is a compile error |
| Language persistence | `localStorage` with try/catch, then browser language, then English | Remembers the choice; works when storage is blocked |
| Page titles | Custom `TitleStrategy` computed in an effect | Titles follow the language, not just the route |
| Responsive | CSS media queries and CSS Grid (`auto-fill`/`auto-fit`, `minmax`) | No JavaScript for layout |

## Practice — Steps

### Step 1: Check licensing and compatibility before choosing a library
**Commands (read-only):** `npm view primeng dist-tags`, `npm view primeng@22.1.2 peerDependencies`, `npm view primeng@21.1.10 peerDependencies`, `npm view @angular/material@22.2.3 license peerDependencies`; read https://primeui.dev/licenses/community.
**Actual result:** The findings above. The learner chose Angular Material.

### Step 2: Install Angular Material and the CDK
```powershell
pnpm add "@angular/material@22.2.3" "@angular/cdk@22.2.3"
```
**Why:** Same version as `@angular/core` 22.2.3.
**Actual result:** Installed 2 packages; `pnpm-lock.yaml` is still the only lockfile. No build scripts needed approval.

### Step 3: Switch to a Sass theme file
**Code:** `src/styles.css` replaced by `src/styles.scss` (and `angular.json` `styles` updated). It applies `mat.theme(...)` to `html`, sets `color-scheme: light dark`, maps `data-theme="light|dark"` to a fixed `color-scheme`, defines `--app-*` aliases (borders, muted text, card surface, status colors with `light-dark()`), and base typography using `--mat-sys-*` tokens.
**Actual result:** The build succeeded; the computed page colors in dark mode were `rgb(18, 19, 22)` background and `rgb(227, 226, 230)` text.

### Step 4: Build the language foundation
**Code (`src/app/i18n/`):**
- `language.ts`: `Lang`, `LANGUAGES` (`en` LTR, `ar` RTL), `LocalizedText`.
- `translations.en.ts` / `translations.ar.ts`: flat key dictionaries. The Arabic file is typed `Record<TranslationKey, string>`.
- `i18n.service.ts`: `lang` and `dir` signals, `t(key, params)`, `pick(localizedText)`, `setLanguage()`, `toggleLanguage()`. It sets `lang` and `dir` on `<html>` immediately and stores the choice.
- `translate.pipe.ts`: `t` and `localized` pipes. They are impure on purpose so they re-run when only the language changes.
- `localized-title.strategy.ts`: sets the document title from the route's `data.pageTitle` function inside an effect.
**Arabic wording:** written by the agent; it should be reviewed by a native Arabic speaker before publishing. The count text avoids Arabic plural forms ("المعروض: 4 من 10").

### Step 5: Build the theme service
**Code:** `src/app/theme/theme.service.ts` — `mode` signal (`light`, `dark`, `system`), writes or removes `data-theme` on `<html>`, stores the choice (try/catch).

### Step 6: Rebuild the layout shell with Material
**Code (`src/app/app.*`):** a `[dir]` directive on the app root (CDK `Dir`) bound to the language; `mat-toolbar` header with the brand link, inline nav (`mat-button`), a language button showing the other language's own name (with its own `lang` attribute and an accessible name), a theme menu (`mat-menu`, items with `role="menuitemradio"`), and a compact "Menu" button; `<main>`; a footer.
**Why the `[dir]` directive:** the CDK docs state that `Directionality.change` does not emit for `dir` changes made only on `<html>`. Material menus and overlays read the direction from the nearest `Dir`, so the root wrapper keeps them correct when the language changes at runtime.
**Responsive rules:** below 600px the inline nav is hidden and the "Menu" button is shown, and the brand takes its own row; the header content aligns with the page content (max 72rem) from 840px up.

### Step 7: Redesign the pages and cards
**Code:** `phase-card` (`mat-card` outlined, status shown as text plus a colored inline-start edge), `phase-list` (`mat-button-toggle-group` filter with an accessible name, `aria-live` count, a grid that is 1 column on phones and grows to 2 and 3), home page (hero, call-to-action `mat-flat-button`, three feature cards), roadmap, phase, lesson (breadcrumb) and not-found pages — all translated.
**Data:** `phases.data.ts` is now bilingual (`title` and `summary` as `{ en, ar }`) and lists the revised ten-phase roadmap.
**RTL rules:** every layout rule uses logical properties (`padding-inline`, `border-inline-start`, `inset-inline-start`, `margin-inline-*`, `max-inline-size`); no `left`/`right` remain in component CSS.

### Step 8: Tests
**Added or updated:** `i18n.service.spec.ts` (defaults, Arabic browser language, stored choice, invalid values, switching, params, unknown keys, blocked storage, and dictionary parity: same keys and same `{placeholders}` in both languages), `theme.service.spec.ts`, and updated `app`, `app.routes`, `phase-card` and `phase-list` specs (language switch updates nav, `dir`, titles and cards; theme menu applies the choice).
**Actual result:** 6 test files, 49 tests passed, exit code 0.

### Step 9: Formatting and production build
**Actual result:** Prettier passes for every file written or changed in this phase. `pnpm build` succeeded: initial total 401.75 kB raw / 100.31 kB transfer (under the 500 kB warning budget), with one lazy chunk per page.

### Step 10: Look at it in a browser
**Actual result (agent, Chrome, against a dev server on port 4300 that was then stopped):**
- Desktop, English, light: header, active nav link, 3-column card grid, home page with feature cards.
- Switching to Arabic: the layout mirrored (nav, filter group, cards and their colored edge), the tab title became Arabic, `<html>` had `lang="ar"` and `dir="rtl"`, and the choice was stored.
- The theme menu opened in RTL with Arabic labels; choosing dark applied the dark theme and focus returned to the menu button.
- Narrow widths were checked in frames, because resizing the window did not change the page's viewport: at 390px (both languages) there was no horizontal overflow, the inline nav was replaced by the "Menu" button, and cards were one column; at 768px the inline nav was shown with a 2-column grid; the compact menu opened with Arabic items.
- The phase page and its tab title were checked after aligning the header to the content width.
- Not checked: Firefox or Safari, a real phone or tablet, a screen reader, keyboard-only use in the new header and menus, contrast of the new Material theme (the old calculated ratios in the Phase 03 guide no longer apply), the production build on a web server.

## Files created or changed
Created: `src/app/i18n/*` (language, translations, service, pipes, title strategy, spec), `src/app/theme/*` (service, spec), `src/styles.scss`, `src/app/pages/home-page/home-page.css`, `src/app/pages/phase-page/phase-page.css`, this guide.
Changed: `package.json`, `pnpm-lock.yaml`, `angular.json` (styles file), `src/app/app.*`, `app.routes.*`, `app.config.ts`, `src/app/pages/*`, `src/app/phases/*`, and the project documents: `AGENTS.md`, `CLAUDE.md`, `README.md`, `docs/product-vision.md`, `docs/learning/PHASE-TEMPLATE.md`, the Phase 04 guide (next-phase line).
Renamed: the `primeng-ui` skill is now `material-ui` (in `ai/skills/`, `.agents/skills/`, `.claude/skills/`); `local-json-content` and `i18n-rtl-ui` were annotated.
Deleted: `src/styles.css`.

## Exercises
1. Guided: add a new UI string key (for example `home.cta2`) to the English dictionary only, and read the compile error that asks for the Arabic text.
2. Independent: add a third language (for example French, LTR) to `LANGUAGES` and the dictionaries, and decide how the switcher should work with three languages.
3. Challenge: change the Material palette in `styles.scss` (try `mat.$violet-palette`), then check both themes for readable contrast.

## Review questions
1. Why is the `[dir]` directive on the app root needed in addition to `dir` on `<html>`?
2. Why are the translate pipes impure, and what is the cost?
3. Why does the Arabic dictionary have type `Record<TranslationKey, string>`?
4. How does the page title change when only the language changes?
5. Why were system fonts and text labels used instead of Material's default Roboto and icon font?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| `Property ... is missing in type` in `translations.ar.ts` | A key was added to the English file only | Add the Arabic text |
| Menus open on the wrong side after switching language | Overlay direction not following the language | Keep the `[dir]` directive on the app root bound to `i18n.dir()` |
| Text updates only after a route change | A pure pipe or a plain method was used with the language | Use the `t` / `localized` pipes or read `i18n.lang()` in a signal |
| Colors do not change with the theme | Hardcoded colors instead of `--mat-sys-*` / `--app-*` tokens | Use the tokens |
| `ng add @angular/material` added Google font links | `ng add` adds fonts and icons to `index.html` | Use `pnpm add` and the Sass theme |
| Window resize does not change the viewport in browser automation | The automation window cannot be narrowed | Test narrow widths inside a frame of the target width |

## Completion checklist
- [x] Read the specified material (agent read the official sources while preparing; the learner has not confirmed reading them)
- [x] Ran the commands (agent-run)
- [x] Verified the expected results (tests, build, browser behavior in Chrome)
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] Arabic wording reviewed by a native speaker
- [ ] User approved the next phase

## Known limitations
- The Arabic text was written by the agent and has not been reviewed by a native speaker.
- Browsers other than Chrome, real devices, screen readers and keyboard-only use of the new header and menus were not tested. `light-dark()` needs a current browser.
- Contrast was not re-measured for the Material theme.
- Phase data is still temporary in-code content. Lesson, roadmap and learn content will come from the owner's Markdown files in Phase 06; the format has not been agreed yet.
- The `local-json-content` skill is out of date and is marked as such; it will be rewritten in Phase 06.
- Language and theme choices use browser local storage.
- Nothing from this phase is committed or pushed yet.

## Summary and next phase
The app is now a designed, responsive, bilingual shell: Angular Material 3 theming with light, dark and system modes, a header with a language switcher and theme menu, a card grid that adapts from phone to desktop, and a language switch that flips the UI, the document `lang`/`dir`, the page titles and the Material overlays between English LTR and Arabic RTL. 49 tests pass and the production build succeeds. Awaiting the learner's review. Proposed next phase: Phase 06, the Markdown content pipeline, which needs a sample `.md` file and decisions on file layout, languages, and how files are loaded. Not started.
