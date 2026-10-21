# Product Vision — Angular Learning Lab

## Purpose
A public learning resource built while the owner learns Angular. Visitors should be able to follow the same steps and reproduce the results on their own machines.

## Audience
- Angular beginners who want a structured path
- Developers upgrading their Angular knowledge
- Arabic-speaking learners who need accurate RTL support
- English-speaking learners who prefer official terminology alongside Arabic explanations

## Product principles
1. Practical first: every lesson has a runnable or verifiable exercise.
2. Reproducible: commands, versions, expected results, and troubleshooting are documented.
3. Bilingual: Arabic and English content are first-class.
4. Accessible: keyboard support, semantics, focus visibility, contrast, and screen-reader labels.
5. Version-aware: documentation links and dependency compatibility are checked against official sources.
6. Local-first: Markdown files supplied by the owner are the source for lesson and roadmap content; adding a file needs no code change.
7. Incremental: implement one approved phase at a time.

## Initial scope
- Landing page and learning roadmap
- Phase/lesson list
- Lesson detail view
- Search/filtering
- Language switcher and RTL/LTR direction
- Code snippets and copy-to-clipboard
- Responsive layout
- Markdown content pipeline (lesson and learn sections for the roadmap and each topic)
- Basic tests and a reproducible setup guide

## Out of scope initially
- Backend/API/database
- User accounts/authentication
- Cloud-synced progress
- Admin CMS
- Nx or Module Federation
- Complex state-management libraries unless a demonstrated need emerges

## Proposed information architecture
- Home
- Learning Roadmap
- Phase Details
- Lesson Details
- Resources
- About / Contribution Guide

## Definition of done for a lesson
A learner can identify the goal, prerequisites, exact setup, steps, expected result, verification, common errors, and a practical exercise without needing private context from the author.
