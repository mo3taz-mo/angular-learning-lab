import { Lang } from '../i18n/language';
import { TranslationKey } from '../i18n/translations.en';

// Shapes of the JSON that scripts/build-content.mjs writes to public/content/ from docs/content.

export type PhaseStatus = 'done' | 'in-progress' | 'planned';

export type PhaseFilter = PhaseStatus | 'all';

export type Section = 'learn' | 'lesson';

export const SECTIONS: readonly Section[] = ['learn', 'lesson'];

export const PHASE_STATUS_KEYS: Readonly<Record<PhaseStatus, TranslationKey>> = {
  done: 'status.done',
  'in-progress': 'status.in-progress',
  planned: 'status.planned',
};

/** One roadmap entry. Titles and summaries exist only for the languages that have a file. */
export interface PhaseSummary {
  readonly id: string;
  readonly order: number;
  readonly status: PhaseStatus;
  readonly languages: readonly Lang[];
  readonly title: Readonly<Partial<Record<Lang, string>>>;
  readonly summary: Readonly<Partial<Record<Lang, string>>>;
}

export interface ContentIndex {
  readonly phases: readonly PhaseSummary[];
}

export interface TocEntry {
  readonly level: number;
  readonly id: string;
  readonly text: string;
}

/** One phase in one language. The HTML strings are produced and escaped by the build script. */
export interface PhaseDocument {
  readonly id: string;
  readonly lang: Lang;
  readonly title: string;
  readonly summary: string;
  readonly order: number;
  readonly status: PhaseStatus;
  readonly intro: string | null;
  readonly learn: string | null;
  readonly lesson: string | null;
  readonly toc: Readonly<Record<Section, readonly TocEntry[]>>;
}

export function isSection(value: unknown): value is Section {
  return value === 'learn' || value === 'lesson';
}
