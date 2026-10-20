import { Phase } from './phase.model';

// Temporary in-code data for Phase 03. Phase 05 replaces this with local JSON content.
export function findPhase(id: string | null | undefined): Phase | undefined {
  return PHASES.find((phase) => phase.id === id);
}

export const PHASES: readonly Phase[] = [
  {
    id: 'phase-00',
    title: 'Environment and repository',
    summary: 'Check Node.js, pnpm and the Angular CLI, and agree the project rules.',
    status: 'done',
  },
  {
    id: 'phase-01',
    title: 'TypeScript refresh',
    summary: 'Revisit the TypeScript features Angular code relies on.',
    status: 'planned',
  },
  {
    id: 'phase-02',
    title: 'Create the app and project anatomy',
    summary: 'Generate the app with pnpm and learn what each generated file does.',
    status: 'done',
  },
  {
    id: 'phase-03',
    title: 'Components, templates and control flow',
    summary: 'Build standalone components with signal inputs, signals and @for / @if / @switch.',
    status: 'in-progress',
  },
  {
    id: 'phase-04',
    title: 'Routing and layout shell',
    summary: 'Add Home, Roadmap, Phase and Lesson routes.',
    status: 'planned',
  },
  {
    id: 'phase-05',
    title: 'Local JSON content and typed models',
    summary: 'Load roadmap and lesson data from local JSON with validation.',
    status: 'planned',
  },
];
