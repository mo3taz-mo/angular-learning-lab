# Phase 07 — Lesson Reading Features

> Status: steps executed by the agent on 2026-10-21, awaiting learner review and approval. "Actual result" lines are what happened; nothing is claimed beyond what was run.

## Goal
Make long lessons easier to read and use: an in-page table of contents, copy buttons on code blocks, and a search box on the roadmap. All three work in Arabic and English, in RTL and LTR, and without new dependencies.

## Decisions (agreed with the owner, 2026-10-21)
| Question | Decision |
|---|---|
| Which features? | All three: table of contents, code copy buttons, roadmap search and filter |
| Does search cover lesson text? | No. It searches phase titles and summaries on the roadmap (the status filter already existed from Phase 03). Searching inside lesson text is a larger step and is left for later |
| New dependencies | None. The CDK `BreakpointObserver` and Material form field/input come from packages already installed |

## Boundaries (what this phase does not do)
- No full-text search of lesson content, no highlighting of the current heading while scrolling.
- The table of contents does not change the URL: opening a page with `#heading` at the end does not scroll to it.
- No progress tracking; the content's checkboxes stay read-only.
- The content files and the build script are unchanged (the heading list already came from the build script in Phase 06).

## Prerequisites
- [x] Phase 06 approved by the learner (2026-10-21)
- [x] Learner's second content file (`phase-01-typescript-foundations.en.md`), which has 28 headings in its Lesson section and 14 code blocks, so the features had real material

## Versions checked
No version-sensitive packages were added. Angular and Material stay at 22.2.3. `afterRenderEffect`, `viewChild`, `toSignal` and `BreakpointObserver` are used as documented for this release: https://angular.dev/guide/signals and https://material.angular.dev/cdk/layout/overview.

## Official reading (optional)
- Angular `afterRenderEffect`: https://angular.dev/api/core/afterRenderEffect
- CDK layout (`BreakpointObserver`): https://material.angular.dev/cdk/layout/overview
- MDN, the `<details>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- MDN, Clipboard API `writeText`: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
- WCAG 2.2, target size (minimum), SC 2.5.8: https://www.w3.org/TR/WCAG22/#target-size-minimum

## Steps

### Step 1: Table of contents ("On this page")
**What:** a new component `SectionToc` (`src/app/content/section-toc/`) lists the `h2` and `h3` headings of the section being read, using the `toc` data the build script already writes. Choosing a heading emits its id; `PhasePage.goToHeading` finds the heading inside `.phase-body`, makes it focusable (`tabindex="-1"`), scrolls to it and moves focus there, so keyboard and screen-reader users continue reading from that heading.
**Why buttons, not links:** a link needs an address that works on its own. The app does not read the URL fragment, so a `#heading` link would look shareable and not work. Buttons say what they do.
**Layout:** at 60rem and wider the list sits beside the text (inline-end, so it flips to the left in Arabic) and sticks while scrolling; on narrower screens it is a collapsed `<details>` above the text. `BreakpointObserver` decides whether it starts open. A section with fewer than two headings shows no list. The heading texts carry the content's own `lang`/`dir`, which matters on an English fallback page inside the Arabic UI.

### Step 2: Copy buttons on code blocks
**What:** `RenderedContent` wraps every `pre.code-block` in a bar showing the language (from the `language-*` class) and a "Copy code" button. This happens after each render with `afterRenderEffect`, using DOM calls and `textContent` only, never HTML strings, so the safety argument for the component is unchanged. One click handler on the container serves all blocks.
**Behaviour:** the code is copied without its trailing newline. The label changes to "Copied" for two seconds and a visually hidden `role="status"` region announces the result. If the browser refuses (no clipboard permission, or a non-secure page), the code is selected instead and the message says to press Ctrl+C. The bar and button follow the UI language and direction (changing language relabels the buttons without wrapping a block twice).
**Accessibility:** a real `<button type="button">`, at least 2rem tall (WCAG 2.2 minimum target size is 24px), visible focus ring.

### Step 3: Roadmap search
**What:** a Material form field with a search input above the status filter. Every word typed must appear in the title or summary shown in the current language (so Arabic UI searches Arabic titles). Text is normalised first: lower case, accents and Arabic diacritics removed (`café` matches `cafe`, vowelled Arabic matches plain Arabic). It combines with the status filter; the existing live "Showing N of M phases" line reports the result, and the empty message now says "No phases match your search or filter."
**Strings:** `roadmap.search.label`, `toc.title`, `code.copy`, `code.copied`, `code.copiedAnnounce`, `code.copyFailed` in both dictionaries (the Arabic wording needs a native speaker's review, like the rest).

### Step 4: Tests, build and checks
**Actual result:**
- Script tests (`pnpm test:content`): 26 passed (unchanged).
- App tests (`pnpm test --watch=false`): 9 files, 95 tests passed. New: search (title, summary, all words, accents, with status filter, clear, Arabic diacritics), the table of contents (labels, indentation, selection, open/closed, language) and its use on the phase page (listed for Learn, hidden for a single heading, scroll and focus), and the copy bars (language name, no double wrapping, relabel on language change, copy without trailing newline, label reset after two seconds, selection fallback, no clipboard).
- Prettier passes for `scripts`, `src/app` and `src/styles.scss`.
- `pnpm build` succeeds: initial total 450.18 kB raw / 114.05 kB transferred (Phase 06: 442 kB / 112 kB).

### Step 5: Check it in a browser
**Actual result (agent, Chrome, a dev server on port 4300 that was then stopped, with the owner's Phase 01 file):**
- Lesson page at 1536px wide: the "On this page" list sat beside the text (28 entries, scrollable, sticky), the page had no horizontal overflow, 14 code blocks had a bar with the language name and "Copy code".
- Choosing "6. Configure TypeScript" scrolled to the heading (16px from the top) and focused it; the screenshot showed the focus ring and the code bar with its button.
- Clicking "Copy code" changed that button's label to "Copied".
- Not verified: what the clipboard actually contained (my attempt to read it back opened a browser permission prompt that froze the automated tab, so the check was abandoned), the roadmap search box on screen, the narrow-width collapsed list, Arabic/RTL appearance of the list and the bars, dark mode, Firefox and Safari, a screen reader. The unit tests cover the behaviour of each, but please look at them yourself.

## Files created or changed
Created: `src/app/content/section-toc/` (component, template, styles, spec), this guide.
Changed: `src/app/content/rendered-content/*` (copy bars, styles, specs), `src/app/pages/phase-page/*` (list, layout), `src/app/phases/phase-list/*` (search), `src/app/i18n/translations.*.ts`, `src/app/content/content.testing.ts` (fixture headings), `src/app/app.routes.spec.ts`.

## Exercises
1. Guided: on a long lesson, use only the keyboard to open "On this page", choose a heading and keep reading with Tab. Where does focus go?
2. Independent: on the roadmap, type an Arabic word that has diacritics in the title (or add `.ar.md` titles with some) and check that the plain spelling finds it.
3. Challenge: make the page open at a heading when the address ends in `#heading`. What has to wait until the content is on screen?

## Review questions
1. Why is the table of contents made of buttons and not links?
2. Why does `goToHeading` set `tabindex="-1"` before focusing a heading?
3. Why are the copy buttons added after rendering, and why with DOM calls and `textContent` instead of an HTML string?
4. What does the copy button do when the browser blocks clipboard access, and why?
5. Why is text normalised before the roadmap search compares it?

## Common errors
| Symptom | Likely cause | Resolution |
|---|---|---|
| No "On this page" list | The section has fewer than two `##`/`###` headings | Add headings, or accept it: a list of one is not shown |
| "Copy code" says to press Ctrl+C | The page is not on `https` or `localhost`, or clipboard permission is blocked | Serve over HTTPS, or copy the selected code by hand |
| A search finds nothing in Arabic | The title is only in English for that phase | Search uses the title and summary in the language being shown; add the `.ar.md` file |
| Reading the clipboard in an automated browser hangs | A permission prompt waits for a person | Do not read the clipboard in automated checks; test with a mocked clipboard |

## Completion checklist
- [x] Read the specified material (agent read the sources while preparing; the learner has not confirmed reading them)
- [x] Ran the commands (agent-run)
- [x] Verified the expected results (tests, build, partial browser checks listed above)
- [ ] Completed or consciously deferred exercises
- [ ] Reviewed the topic without copying
- [ ] Documentation matches actual results
- [ ] Looked at the three features in the browser (list, copy bar, search), in Arabic and on a phone
- [ ] User approved the next phase

## Known limitations
- The table of contents does not update the address, does not highlight the heading being read and cannot be opened at a heading from a link.
- Only titles and summaries are searched, not lesson text.
- The "Day" headings and numbered headings of the Phase 01 file are all second-level, so the list is flat apart from the third-level ones.
- The copy bar is added by script after the content appears, so there is a moment (one frame) when a block shows without it.
- Copy-to-clipboard needs `https` or `localhost`.

## Summary and next phase
Lessons now have an "On this page" list, code blocks have copy buttons and the roadmap has a search box, in both languages, with 95 app tests and 26 script tests passing. Awaiting the learner's review. Phase 08 is not defined yet; candidates are the rest of the planned site (progress tracking in local storage, or searching lesson text) or deployment. Not started, to be agreed with the owner after approval.
