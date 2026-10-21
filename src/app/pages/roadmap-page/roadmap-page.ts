import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { PhaseList } from '../../phases/phase-list/phase-list';
import { PHASES } from '../../phases/phases.data';

@Component({
  imports: [PhaseList, TranslatePipe],
  selector: 'app-roadmap-page',
  templateUrl: './roadmap-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapPage {
  protected readonly phases = PHASES;
}
