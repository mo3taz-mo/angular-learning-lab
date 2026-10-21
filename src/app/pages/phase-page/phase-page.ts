import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { LocalizedPipe, TranslatePipe } from '../../i18n/translate.pipe';
import { PHASE_STATUS_KEYS } from '../../phases/phase.model';
import { findPhase } from '../../phases/phases.data';

@Component({
  imports: [LocalizedPipe, RouterLink, TranslatePipe],
  selector: 'app-phase-page',
  styleUrl: './phase-page.css',
  templateUrl: './phase-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhasePage {
  // Bound from the :phaseId route parameter by withComponentInputBinding().
  readonly phaseId = input.required<string>();

  private readonly i18n = inject(I18nService);

  protected readonly phase = computed(() => findPhase(this.phaseId()));

  protected readonly statusLabel = computed(() => {
    const phase = this.phase();
    return phase ? this.i18n.t(PHASE_STATUS_KEYS[phase.status]) : '';
  });
}
