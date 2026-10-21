import { Dir } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { I18nService } from './i18n/i18n.service';
import { TranslatePipe } from './i18n/translate.pipe';
import { TranslationKey } from './i18n/translations.en';
import { THEME_MODES, ThemeMode, ThemeService } from './theme/theme.service';

interface ThemeOption {
  readonly mode: ThemeMode;
  readonly labelKey: TranslationKey;
}

@Component({
  imports: [
    Dir,
    MatAnchor,
    MatButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslatePipe,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly i18n = inject(I18nService);
  protected readonly theme = inject(ThemeService);

  protected readonly themeOptions: readonly ThemeOption[] = THEME_MODES.map((mode) => ({
    mode,
    labelKey: `theme.${mode}`,
  }));

  private readonly mainContent = viewChild.required<ElementRef<HTMLElement>>('mainContent');

  constructor() {
    // Move focus to the main content after each navigation so keyboard and screen-reader users
    // start at the new page. The first navigation (initial page load) is skipped.
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.focusMain());
  }

  protected focusMain(): void {
    this.mainContent().nativeElement.focus();
  }
}
