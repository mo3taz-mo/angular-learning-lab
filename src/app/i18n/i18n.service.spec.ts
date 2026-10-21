import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { I18nService } from './i18n.service';
import { ar } from './translations.ar';
import { en, TranslationKey } from './translations.en';

describe('I18nService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const create = () => TestBed.inject(I18nService);

  it('should default to English (LTR) and set lang and dir on <html>', () => {
    const service = create();
    expect(service.lang()).toBe('en');
    expect(service.dir()).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
    expect(document.documentElement.dir).toBe('ltr');
  });

  it('should start in Arabic when the browser language is Arabic', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ar-EG');
    const service = create();
    expect(service.lang()).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should prefer the stored language over the browser language', () => {
    vi.spyOn(window.navigator, 'language', 'get').mockReturnValue('ar-EG');
    localStorage.setItem('learning-lab.lang', 'en');
    expect(create().lang()).toBe('en');
  });

  it('should ignore an invalid stored value', () => {
    localStorage.setItem('learning-lab.lang', 'fr');
    expect(create().lang()).toBe('en');
  });

  it('should switch language, direction, document attributes and storage', () => {
    const service = create();
    service.setLanguage('ar');
    expect(service.lang()).toBe('ar');
    expect(service.dir()).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(localStorage.getItem('learning-lab.lang')).toBe('ar');
  });

  it('should toggle between the two languages and offer the other one', () => {
    const service = create();
    expect(service.otherLanguage().code).toBe('ar');
    service.toggleLanguage();
    expect(service.lang()).toBe('ar');
    expect(service.otherLanguage().code).toBe('en');
    service.toggleLanguage();
    expect(service.lang()).toBe('en');
  });

  it('should translate keys and fill in {params}', () => {
    const service = create();
    expect(service.t('nav.home')).toBe('Home');
    expect(service.t('roadmap.count', { shown: 2, total: 6 })).toBe('Showing 2 of 6 phases');
    service.setLanguage('ar');
    expect(service.t('nav.home')).toBe('الرئيسية');
    expect(service.t('roadmap.count', { shown: 2, total: 6 })).toContain('2');
  });

  it('should leave unknown placeholders alone and fall back to the key for unknown keys', () => {
    const service = create();
    expect(service.t('phase.notFound.body', { other: 'x' })).toContain('{id}');
    expect(service.t('does.not.exist' as TranslationKey)).toBe('does.not.exist');
  });

  it('should pick the active language from localized content', () => {
    const service = create();
    const text = { en: 'Hello', ar: 'مرحبا' };
    expect(service.pick(text)).toBe('Hello');
    service.setLanguage('ar');
    expect(service.pick(text)).toBe('مرحبا');
  });

  it('should keep working when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const service = create();
    expect(service.lang()).toBe('en');
    expect(() => service.setLanguage('ar')).not.toThrow();
    expect(service.lang()).toBe('ar');
  });
});

describe('translation dictionaries', () => {
  const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();
  const keys = Object.keys(en) as TranslationKey[];

  it('should have an Arabic string for every English key and nothing extra', () => {
    expect(Object.keys(ar).sort()).toEqual([...keys].sort());
  });

  it('should have no empty strings', () => {
    for (const key of keys) {
      expect(en[key].trim(), `en ${key}`).not.toBe('');
      expect(ar[key].trim(), `ar ${key}`).not.toBe('');
    }
  });

  it('should use the same {placeholders} in both languages', () => {
    for (const key of keys) {
      expect(placeholders(ar[key]), key).toEqual(placeholders(en[key]));
    }
  });
});
