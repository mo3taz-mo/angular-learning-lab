# Shared skill source

The `ai/skills/` directory is the canonical source for reusable, model-agnostic procedures. Native Codex and Claude Code skill wrappers live under `.agents/skills/` and `.claude/skills/` and should stay aligned with these shared instructions.

When changing a skill:
1. Update the canonical version under `ai/skills/`.
2. Update the matching native wrapper/copy.
3. Test the instructions with the target agent.
4. Avoid maintaining contradictory copies.
