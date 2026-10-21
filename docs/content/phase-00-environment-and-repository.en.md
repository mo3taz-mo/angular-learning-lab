---
title: Environment and Repository Preparation
summary: Verify the development tools, prepare a clean project folder, and establish the rules for this Angular learning project.
order: 0
status: done
---

# Phase 00 — Environment and Repository Preparation

> **Goal:** Verify the development tools, prepare a clean project folder, and establish the rules for this Angular learning project.
>
> **Important:** This phase does not create an Angular application yet. We will first verify the installed tools and their executable paths. Move to the next phase only after the checks in this document are complete.

## 1. What you will complete

By the end of this phase, you should have:

- Confirmed which Node.js, npm, pnpm, and Angular CLI executables your terminal is using.
- Checked the installed tool versions.
- Created or identified the project folder.
- Opened that folder in VS Code.
- Established the project conventions used throughout the tutorial.
- Recorded the results so another developer can repeat the setup.

## Learn

## 2. Project rules

We will follow these rules throughout the learning project:

1. **Use the latest stable versions that are officially compatible with one another.** “Latest” does not mean installing packages blindly. Before creating or upgrading the app, check Angular's official compatibility table and the relevant library documentation.
2. **Use pnpm for package management.** Do not mix npm, Yarn, and pnpm for installing project dependencies.
3. **Keep the first version frontend-only.** Example content and sample records will be stored locally as JSON where appropriate. There will be no backend in the initial learning stages.
4. **Use Angular standalone APIs and current recommended patterns** when supported by the selected Angular version.
5. **Use PrimeNG only after verifying compatibility** with the chosen Angular version.
6. **Support English and Arabic**, including real LTR and RTL layout behavior. We will implement and test this in the relevant phase rather than assume that translating text alone is enough.
7. **Document every phase in Markdown.** Each phase document should explain the goal, prerequisites, commands, files changed, expected results, verification steps, common problems, and official references.
8. **Do not add Nx, micro-frontends, a backend, or other infrastructure unless a later phase explicitly requires and approves it.**

## 3. Tools and versions currently reported

These versions were reported before starting this phase. They must be checked in the terminal before we rely on them.

| Tool | Reported version |
|---|---|
| Node.js | `v24.18.0` |
| npm | `11.16.0` |
| pnpm | `10.31.0` |
| Angular CLI (global) | `22.0.5` |
| Editor | Visual Studio Code |
| Operating system | Windows |

A version number alone does not prove that the terminal is using the expected installation. Multiple installations can exist on the same computer, so we will check executable paths as well.

## Lesson

## 4. Step 1 — Open a terminal

You can use either of these options:

### Option A: PowerShell

1. Open the Windows Start menu.
2. Search for **PowerShell**.
3. Open it.

### Option B: VS Code terminal

1. Open Visual Studio Code.
2. Select **Terminal → New Terminal**.
3. Confirm that the terminal profile is PowerShell. If it is not, choose PowerShell from the terminal profile menu.

Run the following commands one at a time.

## 5. Step 2 — Check tool versions

Run:

```powershell
node --version
npm --version
pnpm --version
ng version
```

### Expected result

The output should show versions corresponding to the versions reported above, although `ng version` may display additional Angular CLI information.

If a command is not recognized, **do not install or upgrade anything yet**. Record the exact error and continue with the executable-path checks below.

## 6. Step 3 — Check executable paths

On Windows, run:

```powershell
where.exe node
where.exe npm
where.exe pnpm
where.exe ng
```

### Why are we checking paths?

The `where.exe` command lists executable files found through `PATH`. If more than one path is returned for a tool, your terminal may be able to find multiple installations. This can lead to confusing differences between terminals, editors, and build commands.

### What to record

For each command, record:

- Every path printed by `where.exe`.
- The version printed by the matching version command.
- Any error message, copied exactly.

Do not delete files or change environment variables simply because multiple paths appear. First inspect the results and determine which installation is intended.

## 7. Step 4 — Check Angular and Node.js compatibility

Before creating the application, consult the official Angular compatibility table:

- [Angular — Version compatibility](https://angular.dev/reference/versions)
- [Angular — Installation](https://angular.dev/installation)

Find the row for the Angular version we plan to use and verify its supported Node.js and TypeScript ranges. We will select compatible versions together before running the application-creation command.

**Do not assume that a globally installed Angular CLI automatically determines the Angular version used by a project.** The project can have its own local CLI and framework dependencies.

## 8. Step 5 — Prepare the project folder

If you have already downloaded and extracted the starter pack, open the extracted project folder in VS Code.

For example, if you extracted it to `C:\dev\angular-learning-lab`, you can run:

```powershell
cd C:\dev\angular-learning-lab
code .
```

Replace the example path with the actual folder path on your computer.

If the `code` command is not recognized:

1. Open VS Code.
2. Choose **File → Open Folder**.
3. Select the extracted project folder.

### Verify the folder

Run:

```powershell
Get-Location
Get-ChildItem
```

Confirm that the current directory is the project folder and that the starter files are visible.

If you are unsure which folder you extracted, do not create another folder yet. Locate the extracted folder first so that we avoid duplicate project directories.

## 9. Step 6 — Review the starter documentation

Open and read these files in order:

1. `README.md` — the project's purpose and starting instructions.
2. `AGENTS.md` — general instructions for AI coding agents and contributors.
3. `docs/learning/PHASE-WORKFLOW.md` — how we work through each learning phase.
4. `docs/learning/PHASE-TEMPLATE.md` — the standard structure for phase documentation.
5. This file — `docs/learning/phase-00-environment-and-repository.md`.

If a file is missing, record its name. Do not silently replace or recreate files before checking the starter-pack contents.

## 10. Step 7 — Record the environment results

Create a short note in your own working notes, or add the results to the completion section below. Include:

```text
Operating system:
Terminal:
Node.js version:
Node.js executable path(s):
npm version:
npm executable path(s):
pnpm version:
pnpm executable path(s):
Angular CLI version:
Angular CLI executable path(s):
Project folder:
Compatibility table checked: Yes / No
Problems or warnings:
```

Do not include passwords, access tokens, private keys, or other secrets in this note.

## 11. Troubleshooting

### `node`, `npm`, `pnpm`, or `ng` is not recognized

- Check whether the tool is installed.
- Restart the terminal after an installation or PATH change.
- Run the relevant `where.exe` command.
- Copy the exact error before making changes.

Do not install a second copy of a tool until we understand why the current command is unavailable.

### The version is different from the reported version

- Compare the version command with the paths returned by `where.exe`.
- If multiple paths are returned, inspect them before changing PATH.
- Share the command output so the intended installation can be identified.

### `ng version` reports an Angular CLI version different from the expected one

- Check the output of `where.exe ng`.
- Run `ng version` from the project folder and note whether it reports a local CLI.
- Do not update the global CLI just to make the numbers match. We will choose the project's compatible versions deliberately.

### The `code` command is not recognized

Open VS Code normally, then use **File → Open Folder** to select the project folder. This does not block the rest of the phase.

## 12. Completion checklist

Do not mark this phase complete until the relevant checks have actually been performed.

- [ ] Opened the extracted project folder in VS Code.
- [ ] Ran `node --version`.
- [ ] Ran `npm --version`.
- [ ] Ran `pnpm --version`.
- [ ] Ran `ng version`.
- [ ] Ran `where.exe node`.
- [ ] Ran `where.exe npm`.
- [ ] Ran `where.exe pnpm`.
- [ ] Ran `where.exe ng`.
- [ ] Reviewed the official Angular compatibility table.
- [ ] Recorded the results and any warnings.
- [ ] Confirmed the starter documentation files are present.

## 13. Phase 00 status

**Status:** In progress until the terminal checks are reviewed.

**Next action:** Share the output of these commands before installing, upgrading, or generating anything:

```powershell
where.exe node
where.exe npm
where.exe pnpm
where.exe ng
```

Then we will review the paths and decide whether the environment is ready. We will not create the Angular application until that review is complete.

## Learn

## Official references

- [Angular version compatibility](https://angular.dev/reference/versions)
- [Angular installation guide](https://angular.dev/installation)
- [Node.js official website](https://nodejs.org/)
- [pnpm documentation](https://pnpm.io/)
- [Visual Studio Code documentation](https://code.visualstudio.com/docs)
