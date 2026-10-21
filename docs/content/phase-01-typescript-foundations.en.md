---
title: TypeScript Foundations
summary: Learn the core TypeScript skills used in Angular before creating an Angular application.
order: 1
status: in-progress
---

# Phase 01 — TypeScript Foundations

> **Goal:** Learn core TypeScript skills used in Angular before creating an Angular application.
>
> **Important:** This is a guide, not evidence that the phase is complete. Finish the exercises and final checklist before moving on. No backend or Angular app is created in this phase.

## Learn

## 1. Is this phase already completed?

**Not yet.** Phase 01 was planned as four learning days. This file provides the detailed instructions, but you still need to run the commands, write and modify the examples, and review the results. Phase 00's executable-path checks should also be reviewed before creating the practice workspace.

## 2. Learning outcomes

By the end, you should be able to:
- Use primitive, array, object, and function types.
- Model data with interfaces and type aliases.
- Write classes and understand `public`, `private`, and `readonly`.
- Use generics when they add value.
- Narrow union types safely.
- Use `Partial`, `Pick`, `Omit`, `Record`, and `Readonly`.
- Work with `Promise`, `async`/`await`, and error handling.
- Split code into modules using `export` and `import`.
- Fix TypeScript errors without hiding them with `any`.

## 3. Rules and prerequisites

- Use **pnpm** for package management.
- Do not install Angular or PrimeNG in this phase.
- Keep examples local and in memory; no backend is needed.
- Avoid `any` and `@ts-ignore` as shortcuts.
- Check errors and experiment with each example yourself.
- Use the official documentation linked at the end.

The environment versions reported in the setup notes are Node.js `v24.18.0`, npm `11.16.0`, pnpm `10.31.0`, and global Angular CLI `22.0.5`. Verify them in your terminal; this phase does not require the global Angular CLI.

---

## Lesson

## Day 1 — Types, Interfaces, and Type Aliases

## 4. Read

Read these official pages in order:
1. [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
2. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
3. [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

Focus on `string`, `number`, `boolean`, arrays, object types, optional properties, type inference, interfaces, type aliases, and typed function parameters/returns.

## 5. Create the practice workspace

Only proceed after the Phase 00 environment checks have been reviewed. From the root of your learning project, create a dedicated practice folder:

```powershell
New-Item -ItemType Directory -Force practice\phase-01
Set-Location practice\phase-01
pnpm init
pnpm add -D typescript
pnpm exec tsc --init
```

Why:
- `New-Item` creates a separate place for these exercises.
- `pnpm init` creates a package manifest.
- `pnpm add -D typescript` installs TypeScript as a development dependency.
- `pnpm exec tsc --init` creates a TypeScript configuration.

If your starter repository already has a pnpm workspace arrangement, follow its instructions rather than accidentally creating a conflicting nested package or lockfile. If you are unsure, stop and inspect the repository structure before running these commands.

## 6. Configure TypeScript

Open `tsconfig.json`. The generated file may include many comments and options. Set or confirm the following inside `compilerOptions`, preserving other valid settings unless they conflict:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noEmitOnError": true,
    "skipLibCheck": true
  }
}
```

If an option is rejected, check the installed TypeScript version and the [TSConfig reference](https://www.typescriptlang.org/tsconfig/). This configuration is for small TypeScript exercises, not an Angular app.

## 7. Write your first example

Create `day-1-types.ts`:

```ts
const learnerName: string = "Alex";
const completedLessons: number = 3;
const isLearning: boolean = true;
const topics: string[] = ["types", "interfaces", "functions"];

interface Learner {
  id: number;
  name: string;
  email?: string;
  active: boolean;
}

type LessonStatus = "not-started" | "in-progress" | "completed";

const learner: Learner = {
  id: 1,
  name: learnerName,
  active: isLearning,
};

const status: LessonStatus = "in-progress";

function describeLearner(person: Learner): string {
  return `${person.name} has completed ${completedLessons} lessons.`;
}

console.log(learner);
console.log(topics);
console.log(status);
console.log(describeLearner(learner));
```

Run the type checker:

```powershell
pnpm exec tsc --noEmit
```

Expected result: no TypeScript errors. `--noEmit` checks the files without generating JavaScript.

### Experiment with errors

Make each change separately, run the compiler, and explain the result:
1. Assign a number to `learnerName`.
2. Remove `active` from `learner`.
3. Set `status` to `"paused"`.
4. Add a valid `email`.
5. Add an extra property to the object.

## 8. Type aliases and object shapes

Create `day-1-type-alias.ts`:

```ts
type Identifier = string | number;

type Coordinates = {
  x: number;
  y: number;
};

function formatIdentifier(id: Identifier): string {
  return `ID: ${id}`;
}

const position: Coordinates = { x: 10, y: 20 };

console.log(formatIdentifier(42));
console.log(formatIdentifier("user-42"));
console.log(position);
```

Run `pnpm exec tsc --noEmit`.

An `interface` is commonly used to describe an object shape that can be extended or implemented. A `type` alias can name unions, literal types, tuples, primitives, and object shapes. Both can describe objects; neither is always the right answer in every situation.

**Day 1 checklist**
- [ ] Read the three official pages.
- [ ] Created and compiled both example files.
- [ ] Tested at least three invalid changes.
- [ ] Can explain optional properties and the difference between an interface and a type alias.

---

## Day 2 — Functions, Classes, and Generics

## 9. Read

- [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)

Focus on typed parameters and return values, optional/default parameters, constructors, `public`, `private`, `readonly`, inheritance, generic functions, and generic constraints.

## 10. Classes and functions

Create `day-2-classes.ts`:

```ts
function calculateTotal(price: number, quantity = 1): number {
  return price * quantity;
}

class Course {
  constructor(
    public readonly id: number,
    public title: string,
    private durationInHours: number,
  ) {}

  getSummary(): string {
    return `${this.title} (${this.durationInHours} hours)`;
  }
}

const course = new Course(1, "TypeScript Basics", 4);

console.log(calculateTotal(25, 3));
console.log(course.getSummary());
console.log(course.title);

// Uncomment these one at a time to see the type errors:
// course.id = 2;
// console.log(course.durationInHours);
```

Run:

```powershell
pnpm exec tsc --noEmit
```

Experiment:
1. Try to change `course.id`.
2. Try to access `durationInHours` from outside the class.
3. Change `getSummary()` to declare a `number` return type without changing its return value.
4. Add a method that updates the course title.

Explain why each change succeeds or fails.

## 11. Generics

Create `day-2-generics.ts`:

```ts
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

const firstTopic = firstItem(["types", "classes", "generics"]);
const firstScore = firstItem([90, 85, 100]);

interface ApiResult<T> {
  data: T;
  success: boolean;
}

interface Profile {
  id: number;
  displayName: string;
}

const result: ApiResult<Profile> = {
  data: { id: 7, displayName: "Taylor" },
  success: true,
};

console.log(firstTopic);
console.log(firstScore);
console.log(result.data.displayName);
```

Run `pnpm exec tsc --noEmit`.

`<T>` lets reusable logic work with different types while preserving information about the type in use. Do not make every function generic by default; use a generic when it makes the code more reusable without losing type safety.

**Day 2 checklist**
- [ ] Read the three official pages.
- [ ] Compiled the class and generic examples.
- [ ] Tested `private` and `readonly`.
- [ ] Can explain when a generic is useful.

---

## Day 3 — Unions, Narrowing, and Utility Types

## 12. Read

- [Union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

Focus on union types, literal types, `typeof`, discriminated unions, and `Partial`, `Pick`, `Omit`, `Record`, and `Readonly`.

## 13. Union types and narrowing

Create `day-3-unions.ts`:

```ts
type ItemId = string | number;

function formatId(id: ItemId): string {
  if (typeof id === "number") {
    return `Numeric ID: ${id.toFixed(0)}`;
  }

  return `Text ID: ${id.toUpperCase()}`;
}

type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function describeState(state: LoadState): string {
  switch (state.status) {
    case "idle":
      return "Nothing has started yet.";
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${state.data.length} items.`;
    case "error":
      return `Error: ${state.message}`;
  }
}

console.log(formatId(123));
console.log(formatId("abc-123"));
console.log(describeState({ status: "success", data: ["one", "two"] }));
```

Run `pnpm exec tsc --noEmit`. Notice how checking `typeof id` or `state.status` tells TypeScript which values and properties are safe to use.

## 14. Utility types

Create `day-3-utility-types.ts`:

```ts
interface Account {
  id: number;
  displayName: string;
  email: string;
  active: boolean;
}

type AccountPreview = Pick<Account, "id" | "displayName">;
type AccountUpdate = Partial<Omit<Account, "id">>;
type AccountDirectory = Record<string, AccountPreview>;
type ReadOnlyAccount = Readonly<Account>;

const preview: AccountPreview = { id: 10, displayName: "Jordan" };
const update: AccountUpdate = { active: false };

const directory: AccountDirectory = {
  "account-10": preview,
};

console.log(preview, update, directory);
```

Run `pnpm exec tsc --noEmit`.

Experiment by removing `displayName` from `preview`, attempting to add `id` to an `AccountUpdate`, and trying to mutate a `ReadOnlyAccount`. Explain the resulting compiler messages.

**Day 3 checklist**
- [ ] Read the official pages.
- [ ] Compiled both examples.
- [ ] Can explain narrowing and when to use the listed utility types.

---

## Day 4 — Promises, Async/Await, and Modules

## 15. Read

- [JavaScript Promise reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [Module theory](https://www.typescriptlang.org/docs/handbook/modules/theory.html)

Focus on `Promise<T>`, `async`, `await`, `try`/`catch`, `unknown` errors, and exporting/importing types and functions.

## 16. Async example

Create `day-4-async.ts`:

```ts
interface Lesson {
  id: number;
  title: string;
}

async function loadLessons(): Promise<Lesson[]> {
  // Simulated asynchronous work; no network or backend is used.
  return [
    { id: 1, title: "Types" },
    { id: 2, title: "Generics" },
  ];
}

async function main(): Promise<void> {
  try {
    const lessons = await loadLessons();
    console.log(lessons);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred.");
    }
  }
}

void main();
```

Run `pnpm exec tsc --noEmit`.

An `async` function returns a Promise. `await` gives you the resolved value inside an async function. With strict TypeScript settings, a caught error is `unknown`; narrow it before accessing properties such as `message`.

## 17. Modules

Create `lesson.ts`:

```ts
export interface Lesson {
  id: number;
  title: string;
}

export function formatLesson(lesson: Lesson): string {
  return `${lesson.id}: ${lesson.title}`;
}
```

Create `day-4-modules.ts`:

```ts
import { formatLesson, type Lesson } from "./lesson.js";

const lesson: Lesson = { id: 3, title: "Modules" };
console.log(formatLesson(lesson));
```

Run `pnpm exec tsc --noEmit`.

With `NodeNext` settings, a `.js` extension in a relative import is a common pattern for emitted JavaScript modules. TypeScript can resolve the import to the matching `.ts` source during type-checking. If your module configuration differs, consult the official module guide and keep the setup consistent.

## 18. Final practice exercise

Create a small in-memory learning catalogue with at least these files:

- `catalogue-types.ts` — exported interfaces or type aliases.
- `catalogue-service.ts` — functions to create, find, or format catalogue items.
- `main.ts` — imports and uses the types and functions.

Requirements:
1. Use a typed array.
2. Use an interface or type alias.
3. Use a union or literal type for a status.
4. Use a generic only if it adds value.
5. Export and import at least one type and one function.
6. Include an asynchronous function returning a Promise.
7. Avoid `any`.
8. Run `pnpm exec tsc --noEmit` and fix all errors.

Do not add a database or backend. Keep this exercise in memory; local JSON content will be covered in a later phase.

**Day 4 checklist**
- [ ] Read the async and module guides.
- [ ] Compiled both examples.
- [ ] Completed the catalogue exercise.
- [ ] Can explain Promise, `async`/`await`, and imports/exports.

---

## 19. Final review and completion checklist

Run this command from the practice folder:

```powershell
pnpm exec tsc --noEmit
```

Then check each item honestly:

- [ ] I can type function parameters and return values.
- [ ] I can model data with interfaces and type aliases.
- [ ] I understand optional properties and literal unions.
- [ ] I can explain `private` and `readonly`.
- [ ] I can write a useful generic.
- [ ] I can narrow a union safely.
- [ ] I can explain `Partial`, `Pick`, `Omit`, `Record`, and `Readonly`.
- [ ] I can use `Promise`, `async`, and `await`.
- [ ] I can export and import types and functions across files.
- [ ] All practice files pass the TypeScript check.
- [ ] I completed the final catalogue exercise.
- [ ] I recorded errors and their fixes in this document.

## 20. Troubleshooting

### `pnpm` is not recognized
Return to Phase 00 and inspect the executable path and terminal environment. Do not immediately install a second copy.

### A property does not exist on a type
Check the interface/type alias and whether a union needs narrowing. Do not silence the error with `any`.

### A value might be `undefined`
An array lookup or optional property can be missing. Handle that case explicitly instead of assuming the value exists.

### Module import errors
Check file names, spelling, casing, `module`, and `moduleResolution` in `tsconfig.json`. Consult the [module documentation](https://www.typescriptlang.org/docs/handbook/2/modules.html).

### A `tsconfig` option is rejected
Check your installed TypeScript version and the [TSConfig reference](https://www.typescriptlang.org/tsconfig/). Avoid copying configuration from an unrelated project without checking compatibility.

## 21. Phase status and next step

**Status: In progress until the exercises and final review have actually been completed.**

After finishing, update this file with:
- What you completed.
- Any commands or settings that differed from the guide.
- Errors encountered and how you fixed them.
- The final compiler result.

Do not move to the next phase just because you copied the examples. You should be able to explain and modify them confidently.

## Learn

## Official references

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html)
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
