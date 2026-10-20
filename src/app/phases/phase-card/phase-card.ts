import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Phase } from '../phase.model';

@Component({
  imports: [RouterLink],
  selector: 'app-phase-card',
  styleUrl: './phase-card.css',
  templateUrl: './phase-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseCard {
  readonly phase = input.required<Phase>();
}
