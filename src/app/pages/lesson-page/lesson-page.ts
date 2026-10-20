import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { findPhase } from '../../phases/phases.data';

@Component({
  imports: [RouterLink],
  selector: 'app-lesson-page',
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPage {
  // Both inputs are bound from route parameters by withComponentInputBinding().
  readonly phaseId = input.required<string>();
  readonly lessonId = input.required<string>();

  protected readonly phase = computed(() => findPhase(this.phaseId()));
}
