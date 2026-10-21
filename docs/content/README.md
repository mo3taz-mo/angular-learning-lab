# Content folder

Everything the website shows about the roadmap, its phases, and their lessons comes from the
Markdown files in this folder. **Add or edit a file here and the site updates. No code changes.**
This README is not published (see "Ignored files" below).

## 1. File name

```text
<id>.<language>.md
```

- `<id>`: lowercase letters, numbers and hyphens, for example `phase-01-typescript-refresh`. It
  becomes the page address: `/roadmap/phase-01-typescript-refresh`.
- `<language>`: `en` or `ar`.
- One phase can have one file per language, for example
  `phase-00-environment-and-repository.en.md` and `phase-00-environment-and-repository.ar.md`.
  If a language has no file, the site shows the English file with a short notice.
- Put the files directly in this folder (no subfolders).

## 2. Front matter (required)

Every file starts with a block between two `---` lines:

```markdown
---
title: Environment and Repository Preparation
summary: One or two sentences shown on the roadmap card.
order: 0
status: done
---
```

| Field | Rule |
|---|---|
| `title` | Required text, up to 120 characters. |
| `summary` | Required text, up to 400 characters. |
| `order` | Required whole number, 0 or more. It sets the order on the roadmap. Every phase needs its own number. |
| `status` | `done`, `in-progress` or `planned`. |

If a phase has both an English and an Arabic file, `order` and `status` must be the same in both.
Other fields are rejected, so a typo is caught instead of silently ignored.

A phase that is only planned can be just the front matter with no body. It still appears on the
roadmap, and its Learn and Lesson tabs say "This section has no content yet."

## 3. Body: intro, Learn, Lesson

```markdown
Optional intro text. Shown above the tabs.

## Learn

Concepts, rules, official references...

## Lesson

Steps, exercises, troubleshooting, checklist...
```

- `## Learn` and `## Lesson` are **markers**. They are not shown. They start the two tabs.
  Always write them in English, even in an Arabic file.
- Everything before the first marker is the intro. Everything after a marker belongs to that tab until
  the next marker.
- A marker may appear more than once; the pieces are joined in order.
- All other headings stay as you wrote them. Use `##` and `###` for headings inside a tab.
- A leading `# Title` line is ignored (the title comes from the front matter). Any other `#` heading
  is an error, because each page already has one main heading.

## 4. Markdown you can use

Headings, paragraphs, bold and italic, lists (numbered and bullets), links, tables, `inline code`,
fenced code blocks with a language (` ```powershell `), blockquotes (good for notes and warnings),
horizontal rules, and task lists (`- [ ] item` and `- [x] item`, shown as read-only checkboxes).

- Code is always shown left-to-right, even on Arabic pages.
- Raw HTML is **not** supported: it is shown as plain text. Links starting with `javascript:` are not
  turned into links.

## 5. Ignored files

These are never published, so you can keep notes and drafts here:

- `README.md`
- files whose name starts with `_` or `.` (for example `_draft-phase-03.en.md`)
- files that do not end in `.md`

## 6. Preview and check your files

```powershell
pnpm start            # builds the content, then starts the site at http://localhost:4200/
pnpm content          # only checks and builds the content (fast; prints every problem found)
pnpm content:watch    # in a second terminal: rebuilds whenever a file here changes
```

If any file has a problem, nothing is published and every problem is listed with its file name and
a hint on how to fix it. Fix the file and run again.
