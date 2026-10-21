import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PhaseSummary } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  imports: [MatCard, MatCardContent, RouterLink, TranslatePipe],
  selector: 'app-phase-card',
  styleUrl: './phase-card.css',
  templateUrl: './phase-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseCard {
  readonly phase = input.required<PhaseSummary>();

  private readonly content = inject(ContentService);

  // Title and summary follow the active language, falling back to another language the phase
  // exists in; `textLanguage` marks which one is shown so it is laid out and read correctly.
  protected readonly textLanguage = computed(() => this.content.textLanguage(this.phase()));
  protected readonly title = computed(() => this.content.title(this.phase()));
  protected readonly summary = computed(() => this.content.summary(this.phase()));
}
