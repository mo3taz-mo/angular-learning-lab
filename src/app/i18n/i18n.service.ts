import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';
import { isLang, Lang, LANGUAGES, Language, LocalizedText } from './language';
import { ar } from './translations.ar';
import { en, TranslationKey } from './translations.en';

export type TranslateParams = Readonly<Record<string, string | number>>;

const STORAGE_KEY = 'learning-lab.lang';

const DICTIONARIES: Readonly<Record<Lang, Readonly<Record<TranslationKey, string>>>> = { en, ar };

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);

  readonly lang = signal<Lang>(this.detectInitialLang());
  readonly dir = computed(() => LANGUAGES[this.lang()].dir);

  /** The language the switcher offers (the one that is not active). */
  readonly otherLanguage = computed<Language>(() =>
    this.lang() === 'en' ? LANGUAGES.ar : LANGUAGES.en,
  );

  constructor() {
    this.applyToDocument(this.lang());
  }

  setLanguage(lang: Lang): void {
    this.lang.set(lang);
    this.applyToDocument(lang);
    this.store(lang);
  }

  toggleLanguage(): void {
    this.setLanguage(this.otherLanguage().code);
  }

  /** Looks up a UI string. Reading `lang()` makes templates update when the language changes. */
  t(key: TranslationKey, params?: TranslateParams): string {
    const text = DICTIONARIES[this.lang()][key] ?? DICTIONARIES.en[key] ?? key;
    if (!params) {
      return text;
    }
    return text.replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      name in params ? String(params[name]) : placeholder,
    );
  }

  /** Picks the active language's text from content that exists in every language. */
  pick(text: LocalizedText): string {
    return text[this.lang()] ?? text.en;
  }

  private applyToDocument(lang: Lang): void {
    const root = this.document.documentElement;
    root.lang = lang;
    root.dir = LANGUAGES[lang].dir;
  }

  private detectInitialLang(): Lang {
    const stored = this.read();
    if (isLang(stored)) {
      return stored;
    }
    const browserLanguage = this.document.defaultView?.navigator?.language ?? '';
    return browserLanguage.toLowerCase().startsWith('ar') ? 'ar' : 'en';
  }

  // Storage can be unavailable (private windows, blocked site data); the app must still work.
  private read(): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  private store(lang: Lang): void {
    try {
      this.document.defaultView?.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore: the choice just will not persist.
    }
  }
}
