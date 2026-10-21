export type Lang = 'en' | 'ar';

export type Direction = 'ltr' | 'rtl';

export interface Language {
  readonly code: Lang;
  /** The language's own name, shown in the language switcher. */
  readonly nativeName: string;
  readonly dir: Direction;
}

export const LANGUAGES: Readonly<Record<Lang, Language>> = {
  en: { code: 'en', nativeName: 'English', dir: 'ltr' },
  ar: { code: 'ar', nativeName: 'العربية', dir: 'rtl' },
};

/** Text that may exist in several languages; `pick` falls back to English, then any language. */
export type LocalizedText = Readonly<Partial<Record<Lang, string>>>;

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'ar';
}
