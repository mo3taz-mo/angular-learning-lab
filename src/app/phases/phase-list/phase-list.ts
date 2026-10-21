import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { PHASE_STATUS_KEYS, PhaseFilter, PhaseSummary } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslationKey } from '../../i18n/translations.en';
import { PhaseCard } from '../phase-card/phase-card';

/** Lower case, without accents or Arabic diacritics, so "cafe" finds "café" and plain Arabic finds vowelled Arabic. */
function normalize(text: string): string {
  return text.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase();
}

interface FilterOption {
  readonly value: PhaseFilter;
  readonly labelKey: TranslationKey;
}

@Component({
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    MatFormField,
    MatInput,
    MatLabel,
    PhaseCard,
    TranslatePipe,
  ],
  selector: 'app-phase-list',
  styleUrl: './phase-list.css',
  templateUrl: './phase-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseList {
  readonly phases = input.required<readonly PhaseSummary[]>();

  private readonly content = inject(ContentService);

  protected readonly filterOptions: readonly FilterOption[] = [
    { value: 'all', labelKey: 'roadmap.filter.all' },
    { value: 'done', labelKey: PHASE_STATUS_KEYS['done'] },
    { value: 'in-progress', labelKey: PHASE_STATUS_KEYS['in-progress'] },
    { value: 'planned', labelKey: PHASE_STATUS_KEYS['planned'] },
  ];

  protected readonly filter = signal<PhaseFilter>('all');
  protected readonly query = signal('');

  protected readonly visiblePhases = computed(() => {
    const filter = this.filter();
    // Every word typed must appear in the title or summary shown in the current language.
    const words = normalize(this.query()).split(/\s+/).filter(Boolean);
    return this.phases().filter((phase) => {
      if (filter !== 'all' && phase.status !== filter) {
        return false;
      }
      const text = normalize(`${this.content.title(phase)} ${this.content.summary(phase)}`);
      return words.every((word) => text.includes(word));
    });
  });

  protected search(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected selectFilter(event: MatButtonToggleChange): void {
    this.filter.set(event.value as PhaseFilter);
  }
}
