import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Phase } from '../phase.model';

@Component({
  imports: [],
  selector: 'app-phase-card',
  styleUrl: './phase-card.css',
  templateUrl: './phase-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseCard {
  readonly phase = input.required<Phase>();
}
