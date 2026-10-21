import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizedPipe, TranslatePipe } from '../../i18n/translate.pipe';
import { findPhase } from '../../phases/phases.data';

@Component({
  imports: [LocalizedPipe, RouterLink, TranslatePipe],
  selector: 'app-lesson-page',
  styleUrl: './lesson-page.css',
  templateUrl: './lesson-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPage {
  // Both inputs are bound from route parameters by withComponentInputBinding().
  readonly phaseId = input.required<string>();
  readonly lessonId = input.required<string>();

  protected readonly phase = computed(() => findPhase(this.phaseId()));
}
