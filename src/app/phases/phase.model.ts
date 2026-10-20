export type PhaseStatus = 'done' | 'in-progress' | 'planned';

export type PhaseFilter = PhaseStatus | 'all';

export interface Phase {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: PhaseStatus;
}
