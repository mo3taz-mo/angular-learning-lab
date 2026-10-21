import { LocalizedText } from '../i18n/language';
import { TranslationKey } from '../i18n/translations.en';

export type PhaseStatus = 'done' | 'in-progress' | 'planned';

export type PhaseFilter = PhaseStatus | 'all';

export const PHASE_STATUS_KEYS: Readonly<Record<PhaseStatus, TranslationKey>> = {
  done: 'status.done',
  'in-progress': 'status.in-progress',
  planned: 'status.planned',
};

export interface Phase {
  readonly id: string;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly status: PhaseStatus;
}
