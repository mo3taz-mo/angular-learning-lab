import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { I18nService } from '../i18n/i18n.service';
import { ContentService } from './content.service';
import {
  APP_ID,
  ENV_ID,
  INDEX_FIXTURE,
  TS_ID,
  respondWithDocument,
  respondWithIndex,
} from './content.testing';

describe('ContentService', () => {
  let service: ContentService;
  let i18n: I18nService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ContentService);
    i18n = TestBed.inject(I18nService);
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  it('should have no phases until the index has loaded, then expose them in order', async () => {
    expect(service.phases()).toEqual([]);
    await respondWithIndex();
    expect(service.phases().map((phase) => phase.id)).toEqual([ENV_ID, TS_ID, APP_ID]);
    expect(service.find(TS_ID)?.status).toBe('planned');
    expect(service.find('nope')).toBeUndefined();
  });

  it('should use the active language when that file exists', async () => {
    await respondWithIndex();
    const phase = service.find(ENV_ID)!;
    expect(service.languageFor(phase)).toBe('en');
    expect(service.title(phase)).toBe('Environment');

    i18n.setLanguage('ar');
    expect(service.languageFor(phase)).toBe('ar');
    expect(service.title(phase)).toBe('البيئة');
    expect(service.summary(phase)).toBe('التحقق من الأدوات.');
    expect(service.isFallback(phase)).toBe(false);
  });

  it('should fall back to English when the active language has no file', async () => {
    await respondWithIndex();
    const phase = service.find(TS_ID)!;
    i18n.setLanguage('ar');
    expect(service.languageFor(phase)).toBe('en');
    expect(service.title(phase)).toBe('TypeScript refresh');
    expect(service.isFallback(phase)).toBe(true);
  });

  it('should fall back to the only available language when English is missing', async () => {
    const phase = {
      id: 'only-ar',
      order: 9,
      status: 'planned' as const,
      languages: ['ar' as const],
      title: { ar: 'عنوان' },
      summary: { ar: 'ملخص' },
    };
    expect(service.languageFor(phase)).toBe('ar');
    expect(service.title(phase)).toBe('عنوان');
  });

  it('should load a phase document for the active language and reload when it changes', async () => {
    await respondWithIndex();
    const id = signal<string | undefined>(ENV_ID);
    const document = TestBed.runInInjectionContext(() => service.document(id));

    await respondWithDocument(ENV_ID, 'en');
    expect(document.hasValue()).toBe(true);
    expect(document.value()?.title).toBe('Environment');

    i18n.setLanguage('ar');
    await respondWithDocument(ENV_ID, 'ar');
    expect(document.value()?.lang).toBe('ar');
    expect(document.value()?.title).toBe('البيئة');
  });

  it('should request the fallback language file for a phase without the active language', async () => {
    await respondWithIndex();
    i18n.setLanguage('ar');
    const document = TestBed.runInInjectionContext(() => service.document(() => TS_ID));
    await respondWithDocument(TS_ID, 'en');
    expect(document.value()?.lang).toBe('en');
  });

  it('should not request anything for an unknown phase id', async () => {
    await respondWithIndex();
    TestBed.runInInjectionContext(() => service.document(() => 'unknown'));
    TestBed.tick();
    await TestBed.inject(ApplicationRef).whenStable();
    // afterEach(verify) fails the test if any request is still open
    expect(service.find('unknown')).toBeUndefined();
  });

  it('should report an error when the index cannot be loaded', async () => {
    TestBed.tick();
    TestBed.inject(HttpTestingController)
      .expectOne('content/index.json')
      .flush('boom', { status: 500, statusText: 'Server error' });
    await TestBed.inject(ApplicationRef).whenStable();
    expect(service.index.error()).toBeTruthy();
    expect(service.phases()).toEqual([]);
    expect(INDEX_FIXTURE.phases.length).toBe(3);
  });
});
