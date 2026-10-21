import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { LocalizedPipe, TranslatePipe } from '../../i18n/translate.pipe';
import { Phase } from '../phase.model';

@Component({
  imports: [LocalizedPipe, MatCard, MatCardContent, RouterLink, TranslatePipe],
  selector: 'app-phase-card',
  styleUrl: './phase-card.css',
  templateUrl: './phase-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhaseCard {
  readonly phase = input.required<Phase>();
}
