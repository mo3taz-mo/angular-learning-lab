import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PhaseList } from './phases/phase-list/phase-list';
import { PHASES } from './phases/phases.data';

@Component({
  imports: [PhaseList],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly phases = PHASES;
}
