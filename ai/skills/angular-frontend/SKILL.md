---
name: angular-frontend
description: Build, review, or debug Angular features using the project's modern Angular conventions, official version compatibility, and testable patterns.
---

# Angular Frontend Skill

1. Inspect the repository and read `AGENTS.md` before editing.
2. Check the installed Angular version in `package.json` and lockfile; do not infer it from global CLI alone.
3. For version-sensitive APIs, consult the official Angular documentation and version compatibility table.
4. Prefer standalone components, strict TypeScript, typed inputs/outputs, modern template control flow, and dependency injection using `inject()` where appropriate.
5. Use signals for suitable local synchronous state; use RxJS for streams and asynchronous composition when it fits better.
6. Avoid nested subscriptions, unhandled promises, duplicated state, and unnecessary abstractions.
7. Keep components focused; separate data access and reusable business logic into services when justified.
8. Add or update tests for behavior changes.
9. Run relevant checks and report exact commands and outcomes. Never claim unrun checks passed.
10. Update the active phase guide when the change is part of the learning curriculum.
