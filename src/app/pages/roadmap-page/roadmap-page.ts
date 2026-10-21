import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContentService } from '../../content/content.service';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { PhaseList } from '../../phases/phase-list/phase-list';

@Component({
  imports: [PhaseList, TranslatePipe],
  selector: 'app-roadmap-page',
  templateUrl: './roadmap-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapPage {
  protected readonly content = inject(ContentService);
}
