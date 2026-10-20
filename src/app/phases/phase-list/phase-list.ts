import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Phase, PhaseFilter } from '../phase.model';
import { PhaseCard } from '../phase-card/phase-card';

interface FilterOption {
  readonly value: PhaseFilter;
  readonly label: string;
}

@Component({
  imports: [PhaseCard],
  selector: 'app-phase-list',
  styleUrl: './phase-list.css',
  templateUrl: './phase-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseList {
  readonly phases = input.required<readonly Phase[]>();

  protected readonly filterOptions: readonly FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: 'done', label: 'Done' },
    { value: 'in-progress', label: 'In progress' },
    { value: 'planned', label: 'Planned' },
  ];

  protected readonly filter = signal<PhaseFilter>('all');

  protected readonly visiblePhases = computed(() => {
    const filter = this.filter();
    const phases = this.phases();
    return filter === 'all' ? phases : phases.filter((phase) => phase.status === filter);
  });

  protected selectFilter(value: PhaseFilter): void {
    this.filter.set(value);
  }
}
