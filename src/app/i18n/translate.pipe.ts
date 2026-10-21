import { inject, Pipe, PipeTransform } from '@angular/core';
import { LocalizedText } from './language';
import { I18nService, TranslateParams } from './i18n.service';
import { TranslationKey } from './translations.en';

// Both pipes are impure on purpose: they read the language signal inside `transform`, and a pure
// pipe would not re-run when only the language changes.

/** `{{ 'nav.home' | t }}` — keys are type-checked against the English dictionary. */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: TranslationKey, params?: TranslateParams): string {
    return this.i18n.t(key, params);
  }
}

/** `{{ phase.title | localized }}` — picks the active language from per-language text. */
@Pipe({ name: 'localized', pure: false })
export class LocalizedPipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(text: LocalizedText): string {
    return this.i18n.pick(text);
  }
}
