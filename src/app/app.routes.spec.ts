import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { Router, provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import {
  APP_ID,
  ENV_ID,
  TS_ID,
  navigated,
  respond,
  respondWithDocument,
  respondWithIndex,
} from './content/content.testing';
import { I18nService } from './i18n/i18n.service';
import { LocalizedTitleStrategy } from './i18n/localized-title.strategy';

describe('routes', () => {
  let harness: RouterTestingHarness;

  const root = () => harness.routeNativeElement as HTMLElement;
  const heading = () => root().querySelector('h1')?.textContent?.trim();
  const text = () => root().textContent ?? '';
  const documentTitle = () => TestBed.inject(Title).getTitle();
  const tabs = () => Array.from(root().querySelectorAll('nav[mat-tab-nav-bar] a'));

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TitleStrategy, useExisting: LocalizedTitleStrategy },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => TestBed.inject(HttpTestingController).verify());

  describe('home and not-found', () => {
    it('should show the home page at /', async () => {
      await harness.navigateByUrl('/');
      await respondWithIndex();
      expect(heading()).toBe('Angular Learning Lab');
      expect(documentTitle()).toBe('Home | Angular Learning Lab');
    });

    it('should show the not-found page for an unknown URL', async () => {
      await harness.navigateByUrl('/no/such/page');
      await respondWithIndex();
      expect(heading()).toBe('Page not found');
      expect(documentTitle()).toBe('Page not found | Angular Learning Lab');
    });

    it('should show the not-found page for a phase section that does not exist', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/lessons`);
      await respondWithIndex();
      expect(heading()).toBe('Page not found');
    });

    it('should show the not-found page for extra path segments after a section', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn/more`);
      await respondWithIndex();
      expect(heading()).toBe('Page not found');
    });
  });

  describe('roadmap', () => {
    it('should show a loading message, then one card per phase from the content index', async () => {
      await harness.navigateByUrl('/roadmap');
      expect(heading()).toBe('Learning roadmap');
      expect(root().querySelector('[role="status"]')?.textContent).toContain('Loading');

      await respondWithIndex();
      const titles = Array.from(root().querySelectorAll('app-phase-card h3')).map((h) =>
        h.textContent?.trim(),
      );
      expect(titles).toEqual(['Environment', 'TypeScript refresh', 'Create the app']);
      expect(documentTitle()).toBe('Learning roadmap | Angular Learning Lab');
    });

    it('should explain when no phase is published yet', async () => {
      await harness.navigateByUrl('/roadmap');
      await respond('content/index.json', { phases: [] });
      expect(text()).toContain('No phases have been published yet.');
    });

    it('should show an error when the content cannot be loaded', async () => {
      await harness.navigateByUrl('/roadmap');
      await respond('content/index.json', null, 500);
      expect(root().querySelector('[role="alert"]')?.textContent).toContain(
        'The content could not be loaded',
      );
    });

    it('should open the phase from a card link', async () => {
      await harness.navigateByUrl('/roadmap');
      await respondWithIndex();
      const link = root().querySelector<HTMLAnchorElement>(
        `app-phase-card a[href="/roadmap/${APP_ID}"]`,
      );
      expect(link).toBeTruthy();
      const done = navigated();
      link!.click();
      await done;
      await respondWithDocument(APP_ID, 'en');
      expect(heading()).toBe('Create the app');
      expect(TestBed.inject(Router).url).toBe(`/roadmap/${APP_ID}/learn`);
    });
  });

  describe('phase page', () => {
    it('should redirect /roadmap/:id to its Learn section', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'en');
      expect(TestBed.inject(Router).url).toBe(`/roadmap/${ENV_ID}/learn`);
    });

    it('should show the title, intro, Learn content and a tab for each section', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'en');

      expect(heading()).toBe('Environment');
      expect(text()).toContain('Check the tools.');
      expect(text()).toContain('Status: Done');
      expect(text()).toContain('Goal (en)');
      expect(text()).toContain('Learn text (en)');
      expect(text()).not.toContain('node --version');
      expect(tabs().map((tab) => tab.textContent?.trim())).toEqual(['Learn', 'Lesson']);
      expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
      expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
      expect(documentTitle()).toBe('Environment - Learn | Angular Learning Lab');
    });

    it('should show the Lesson section on its own address', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/lesson`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'en');

      expect(text()).toContain('node --version');
      expect(text()).not.toContain('Learn text (en)');
      expect(root().querySelector('pre.code-block')?.getAttribute('dir')).toBe('ltr');
      expect(root().querySelector('input.task-checkbox')).toBeTruthy();
      expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
      expect(documentTitle()).toBe('Environment - Lesson | Angular Learning Lab');
    });

    it('should switch sections with the tabs without reloading the document', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'en');

      const done = navigated();
      (tabs()[1] as HTMLAnchorElement).click();
      await done;

      expect(TestBed.inject(Router).url).toBe(`/roadmap/${ENV_ID}/lesson`);
      expect(text()).toContain('node --version');
      // afterEach(verify) fails if the tab change caused another request
    });

    it('should say so when a section has no content yet', async () => {
      await harness.navigateByUrl(`/roadmap/${TS_ID}/lesson`);
      await respondWithIndex();
      await respondWithDocument(TS_ID, 'en');
      expect(heading()).toBe('TypeScript refresh');
      expect(text()).toContain('This section has no content yet.');
    });

    it('should show a not-found message for an unknown phase id', async () => {
      await harness.navigateByUrl('/roadmap/phase-99/learn');
      await respondWithIndex();
      expect(heading()).toBe('Phase not found');
      expect(text()).toContain('There is no phase with the id "phase-99".');
      expect(documentTitle()).toBe('Phase not found | Angular Learning Lab');
    });

    it('should show an error when the document cannot be loaded', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn`);
      await respondWithIndex();
      await respond(`content/${ENV_ID}.en.json`, null, 404);
      expect(heading()).toBe('Environment');
      expect(root().querySelector('[role="alert"]')?.textContent).toContain(
        'The content could not be loaded',
      );
    });
  });

  describe('Arabic', () => {
    it('should load the Arabic file and show Arabic page, tabs and title', async () => {
      TestBed.inject(I18nService).setLanguage('ar');
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'ar');

      expect(heading()).toBe('البيئة');
      expect(text()).toContain('Learn text (ar)');
      expect(tabs().map((tab) => tab.textContent?.trim())).toEqual(['تعلّم', 'الدرس']);
      expect(documentTitle()).toBe('البيئة - تعلّم | مختبر أنجولار للتعلّم');
      expect(root().querySelector('.content-notice')).toBeNull();
      const content = root().querySelector('.rendered-content')!;
      expect([content.getAttribute('lang'), content.getAttribute('dir')]).toEqual(['ar', 'rtl']);
    });

    it('should load the other language when the language changes on the page', async () => {
      await harness.navigateByUrl(`/roadmap/${ENV_ID}/learn`);
      await respondWithIndex();
      await respondWithDocument(ENV_ID, 'en');

      TestBed.inject(I18nService).setLanguage('ar');
      await respondWithDocument(ENV_ID, 'ar');

      expect(heading()).toBe('البيئة');
      expect(text()).toContain('Learn text (ar)');
      expect(documentTitle()).toBe('البيئة - تعلّم | مختبر أنجولار للتعلّم');
    });

    it('should show the English file with a notice when there is no Arabic file', async () => {
      TestBed.inject(I18nService).setLanguage('ar');
      await harness.navigateByUrl(`/roadmap/${TS_ID}/learn`);
      await respondWithIndex();
      await respondWithDocument(TS_ID, 'en');

      expect(heading()).toBe('TypeScript refresh');
      const notice = root().querySelector('.content-notice')?.textContent ?? '';
      expect(notice).toContain('العربية');
      expect(notice).toContain('English');
      // The English text is marked as English and left-to-right inside the Arabic page.
      const headingBox = root().querySelector('h1')!.parentElement!;
      expect([headingBox.lang, headingBox.dir]).toEqual(['en', 'ltr']);
    });

    it('should translate the roadmap and not-found pages', async () => {
      TestBed.inject(I18nService).setLanguage('ar');
      await harness.navigateByUrl('/roadmap');
      await respondWithIndex();
      expect(heading()).toBe('خارطة طريق التعلّم');
      expect(documentTitle()).toBe('خارطة طريق التعلّم | مختبر أنجولار للتعلّم');

      await harness.navigateByUrl('/no/such/page');
      expect(heading()).toBe('الصفحة غير موجودة');
    });
  });
});
