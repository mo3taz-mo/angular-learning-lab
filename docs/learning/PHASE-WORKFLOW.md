# Learning Phase Workflow

This document defines how each learning phase is studied, implemented, reviewed, and published.

## Before a phase
1. Agree on the phase goal and boundaries.
2. List prerequisites and check the environment.
3. Select official documentation first; use videos only when they add value.
4. Write the commands and expected results before execution.
5. Create or update the phase Markdown guide.

## During a phase
For every step, record:
- What we are doing
- Why it matters
- Exact command or code
- What the command changes
- Expected output
- How to verify success
- Common errors and how to diagnose them

Do not fabricate output. If a step has not been run, label the output as expected rather than verified.

## Study cycle
1. Learn: understand the concept and vocabulary.
2. Practice: type and run the code independently.
3. Recall: repeat the task without copying.
4. Review: revisit after 1, 3, 7, and 14 days.

## Completion gate
A phase is complete only when:
- The user has run the required steps or explicitly marks them as skipped.
- Verification results are captured.
- Exercises and review questions are answered or deliberately deferred.
- The guide matches the repository state.
- Relevant checks have run and their results are recorded.
- The user approves moving to the next phase.

## File naming
Use stable, ordered names, for example:
- `phase-00-environment-and-repository.md`
- `phase-01-typescript-refresh.md`
- `phase-02-angular-project-anatomy.md`

## Guide template
Copy `PHASE-TEMPLATE.md` for each new phase.
