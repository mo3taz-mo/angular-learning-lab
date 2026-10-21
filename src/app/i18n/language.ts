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

/** Text that exists in every supported language, used for content that is not UI chrome. */
export type LocalizedText = Readonly<Record<Lang, string>>;

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'ar';
}
