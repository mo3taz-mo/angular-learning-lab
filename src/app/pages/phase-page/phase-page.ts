import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PHASE_STATUS_LABELS } from '../../phases/phase.model';
import { findPhase } from '../../phases/phases.data';

@Component({
  imports: [RouterLink],
  selector: 'app-phase-page',
  templateUrl: './phase-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhasePage {
  // Bound from the :phaseId route parameter by withComponentInputBinding().
  readonly phaseId = input.required<string>();

  protected readonly phase = computed(() => findPhase(this.phaseId()));

  protected readonly statusLabel = computed(() => {
    const phase = this.phase();
    return phase ? PHASE_STATUS_LABELS[phase.status] : '';
  });
}
