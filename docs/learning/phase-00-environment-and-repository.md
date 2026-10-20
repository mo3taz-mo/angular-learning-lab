# Phase 00 — Environment and Repository Foundation

## Goal
Confirm a reproducible local development environment before creating the Angular Learning Lab application.

## Known environment from the learner
- OS: Windows (PowerShell / VS Code)
- Node.js: `v24.18.0`
- npm: `11.16.0`
- pnpm: `10.31.0`
- Global Angular CLI: `22.0.5`
- Editor: VS Code

These versions were supplied by the learner. They have not been independently inspected from the machine.

## Important decisions
- Do not reinstall tools that already work.
- Use pnpm as the only package manager for this repository.
- Check official Angular compatibility before creating the application.
- Global Angular CLI does not prove which `@angular/core` version is installed in a project.
- Do not create the app until path checks are complete.

## Step 1 — Check executable paths
Open VS Code → Terminal → New Terminal and run:

```powershell
where.exe node
where.exe ng
where.exe pnpm
```

### Why
This shows which executable Windows resolves. Multiple results are not automatically wrong, but they should be reviewed if they point to conflicting installations.

### Expected result
One or more paths for each installed executable. Record actual output in your own notes; do not invent it.

## Step 2 — Check tool versions
```powershell
node --version
npm --version
pnpm --version
ng version
```

### Known output supplied by learner
```text
Node: v24.18.0
Npm: 11.16.0
Pnpm: 10.31.0
Ng: 22.0.5
```

## Path check results (Claude Code PowerShell session, 2026-10-20)
These were run by the agent, not in the learner's VS Code terminal.

| Command | Result |
|---|---|
| `where.exe node` | `C:\Program Files\nodejs\node.exe` |
| `where.exe ng` | not found |
| `where.exe pnpm` | `C:\Program Files\nodejs\pnpm`, `C:\Program Files\nodejs\pnpm.CMD` (Corepack shim) |
| `node --version` | `v24.15.0` |
| `npm --version` | `11.12.1` |
| `pnpm --version` | `11.9.0` |
| `npm ls -g --depth=0` | `corepack@0.34.6`, `npm@11.12.1` (no `@angular/cli`) |

### Findings
- `C:\Program Files\nodejs` is a symbolic link to `%APPDATA%\nvm\v24.15.0`; Node is managed by nvm-windows. nvm also has `v26.1.0` installed but not active.
- `nvm` and `nodejs` directories appear in both the User and Machine PATH. This is redundant but does not cause conflicting installs.
- No second Node installation was found.
- No `package.json` or lockfile exists in the project yet.

### Discrepancies with the learner-supplied versions
| Tool | Learner-supplied | Observed in agent session |
|---|---|---|
| Node.js | v24.18.0 | v24.15.0 |
| npm | 11.16.0 | 11.12.1 |
| pnpm | 10.31.0 | 11.9.0 |
| Angular CLI (global) | 22.0.5 | not installed |

The learner's VS Code terminal may use a different PATH or nvm version. Re-run Steps 1 and 2 there and record the output before deciding which set is correct. Decide on a pnpm major version and pin it with the `packageManager` field once `package.json` exists. Without a global `ng`, the app can be created with `pnpm dlx @angular/cli@<version> new`.

### Global Angular CLI and PATH fix
- The learner installed Angular CLI globally with pnpm. It landed in `%LOCALAPPDATA%\pnpm\bin`, which was not on PATH, so `ng` was not found (`pnpm bin -g` reported: "The configured global bin directory ... is not in PATH").
- Fix: run `pnpm setup` in a new PowerShell window, then reopen VS Code and any terminals. This added `%PNPM_HOME%\bin` to the User PATH (stored as an expandable string, so the variable is resolved by new processes).
- After the fix, a fresh-environment check resolved `ng` to `%LOCALAPPDATA%\pnpm\bin\ng.CMD` and `ng version` reported:

| Tool | Verified |
|---|---|
| Angular CLI (global) | 22.2.3 |
| Node.js | 24.15.0 |
| npm | 11.12.1 |
| pnpm | 11.9.0 |

- `ng version` lists "Package Manager: npm" because it is run outside a project. Once the app exists, run `ng config cli.packageManager pnpm`.
- Already-open terminals keep the old PATH until they are restarted.

### Official compatibility check
Source: https://angular.dev/reference/versions (fetched 2026-10-20).

| Angular | Node.js | TypeScript | RxJS |
|---|---|---|---|
| 22.0.x | `^22.22.3 \|\| ^24.15.0 \|\| ^26.0.0` | `>=6.0.0 <6.1.0` | `^6.5.3 \|\| ^7.4.0` |
| 21.x | `^20.19.0 \|\| ^22.12.0 \|\| ^24.0.0` | `>=5.9.0 <6.0.0` | `^6.5.3 \|\| ^7.4.0` |

The installed Node.js `24.15.0` satisfies `^24.15.0`, the minimum for Angular 22.x. TypeScript is installed per project, so it is not checked here.

The angular.dev table lists 22.0.x only, so the 22.2 line was checked against the npm registry package metadata (`npm view "@angular/core@22.2.3" engines peerDependencies --json`, and the same for `@angular/cli` and `@angular/compiler-cli`). `22.2.3` is the `latest` dist-tag of `@angular/core`.

| Package (22.2.3) | Node.js | Other |
|---|---|---|
| `@angular/cli` | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | |
| `@angular/core` | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | peers: `rxjs ^6.5.3 \|\| ^7.4.0`, `zone.js ~0.15.0 \|\| ~0.16.0` |
| `@angular/compiler-cli` | `^22.22.3 \|\| ^24.15.0 \|\| >=26.0.0` | peer: `typescript >=6.0 <6.1` |

Result: Node.js 24.15.0 is supported by Angular 22.2.3, and the project needs TypeScript 6.0.x.

### Folder rename
The parent folder `anhular_hub` (typo) was renamed to `angular_hub` by the learner after closing VS Code and Claude Code. The rename is verified: the old folder no longer exists and the project is at `C:\agents\codex\angular_hub\angular-learning-lab`.

## Official reading
- Angular version compatibility: https://angular.dev/reference/versions
- Angular CLI setup: https://angular.dev/tools/cli/setup-local
- pnpm installation: https://pnpm.io/installation
- Node.js downloads: https://nodejs.org/en/download

## Completion gate
- [x] Executable paths checked (agent session)
- [x] Version outputs recorded from learner
- [x] Any conflicting paths reviewed (none found in agent session)
- [x] Global `ng` on PATH (via `pnpm setup`); versions verified by agent
- [x] Version discrepancies resolved (the verified values in this guide replace the learner-supplied list)
- [x] Angular 22.2.3 / Node 24.15.0 compatibility checked from official sources
- [x] Parent folder renamed from `anhular_hub` to `angular_hub`
- [x] User confirms environment is ready (Phase 00 approved by the learner, 2026-10-20)

## Known limitations
- The checks were run from the Claude Code PowerShell session, not recorded from the learner's own VS Code terminal.
- The pnpm major version (11.9.0 vs the 10.31.0 originally supplied) is not pinned yet; pin it with the `packageManager` field once `package.json` exists.

## Next phase
No Angular application has been created yet. The next phase list is to be agreed with the learner before any `ng new` command is run.
