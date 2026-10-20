export type PhaseStatus = 'done' | 'in-progress' | 'planned';

export type PhaseFilter = PhaseStatus | 'all';

export const PHASE_STATUS_LABELS: Record<PhaseStatus, string> = {
  done: 'Done',
  'in-progress': 'In progress',
  planned: 'Planned',
};

export interface Phase {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly status: PhaseStatus;
}
