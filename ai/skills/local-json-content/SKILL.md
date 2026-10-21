---
name: local-json-content
description: Model and load local JSON lesson content safely in Angular without introducing a backend or database.
---

# Local JSON Content Skill

> Status: out of date. The owner supplies lesson and learn content as Markdown (`.md`) files, which the app must load without code changes (see `AGENTS.md`). Rewrite this skill, including renaming it, once the content format is agreed in the content-pipeline phase. Until then, only the safety rules below still apply (typed data, no `eval`, graceful handling of missing content, no backend).

1. Keep lesson/catalog content in local JSON for the initial product phase.
2. Define TypeScript interfaces or types for the JSON schema and keep locale-specific content explicit.
3. Validate assumptions at the data boundary; handle missing fields and unknown IDs gracefully.
4. Do not treat JSON content as executable code and never use `eval`.
5. Keep content data separate from presentation components.
6. Use Angular's supported asset/data-loading approach for the current project setup; verify paths in the actual build configuration.
7. Do not add a backend, database, authentication, or cloud sync unless explicitly approved.
8. Include sample records for both Arabic and English and test missing/invalid content behavior where appropriate.
9. Explain in documentation that JSON files are source-controlled public content, not a secure place for secrets.
