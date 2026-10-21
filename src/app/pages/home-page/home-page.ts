import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TranslationKey } from '../../i18n/translations.en';

interface Feature {
  readonly titleKey: TranslationKey;
  readonly bodyKey: TranslationKey;
}

@Component({
  imports: [MatAnchor, MatCard, MatCardContent, RouterLink, TranslatePipe],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly features: readonly Feature[] = [
    {
      titleKey: 'home.feature.practical.title',
      bodyKey: 'home.feature.practical.body',
    },
    {
      titleKey: 'home.feature.reproducible.title',
      bodyKey: 'home.feature.reproducible.body',
    },
    {
      titleKey: 'home.feature.bilingual.title',
      bodyKey: 'home.feature.bilingual.body',
    },
  ];
}
