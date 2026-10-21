import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { PHASE_STATUS_KEYS, PhaseFilter, PhaseSummary } from '../../content/content.model';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslationKey } from '../../i18n/translations.en';
import { PhaseCard } from '../phase-card/phase-card';

interface FilterOption {
  readonly value: PhaseFilter;
  readonly labelKey: TranslationKey;
}

@Component({
  imports: [MatButtonToggle, MatButtonToggleGroup, PhaseCard, TranslatePipe],
  selector: 'app-phase-list',
  styleUrl: './phase-list.css',
  templateUrl: './phase-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseList {
  readonly phases = input.required<readonly PhaseSummary[]>();

  protected readonly filterOptions: readonly FilterOption[] = [
    { value: 'all', labelKey: 'roadmap.filter.all' },
    { value: 'done', labelKey: PHASE_STATUS_KEYS['done'] },
    { value: 'in-progress', labelKey: PHASE_STATUS_KEYS['in-progress'] },
    { value: 'planned', labelKey: PHASE_STATUS_KEYS['planned'] },
  ];

  protected readonly filter = signal<PhaseFilter>('all');

  protected readonly visiblePhases = computed(() => {
    const filter = this.filter();
    const phases = this.phases();
    return filter === 'all' ? phases : phases.filter((phase) => phase.status === filter);
  });

  protected selectFilter(event: MatButtonToggleChange): void {
    this.filter.set(event.value as PhaseFilter);
  }
}
