import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { I18nService } from './i18n/i18n.service';
import { LocalizedTitleStrategy } from './i18n/localized-title.strategy';

describe('routes', () => {
  let harness: RouterTestingHarness;

  const heading = () => harness.routeNativeElement?.querySelector('h1')?.textContent?.trim();
  const documentTitle = () => TestBed.inject(Title).getTitle();

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        { provide: TitleStrategy, useExisting: LocalizedTitleStrategy },
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('should show the home page at /', async () => {
    await harness.navigateByUrl('/');
    expect(heading()).toBe('Angular Learning Lab');
    expect(documentTitle()).toBe('Home | Angular Learning Lab');
  });

  it('should show the roadmap at /roadmap', async () => {
    await harness.navigateByUrl('/roadmap');
    expect(heading()).toBe('Learning roadmap');
    expect(harness.routeNativeElement?.querySelectorAll('app-phase-card').length).toBeGreaterThan(
      0,
    );
    expect(documentTitle()).toBe('Learning roadmap | Angular Learning Lab');
  });

  it('should show a phase from the :phaseId parameter', async () => {
    await harness.navigateByUrl('/roadmap/phase-03');
    expect(heading()).toBe('Components, templates and control flow');
    expect(documentTitle()).toBe('Components, templates and control flow | Angular Learning Lab');
  });

  it('should show a not-found message for an unknown phase id', async () => {
    await harness.navigateByUrl('/roadmap/phase-99');
    expect(heading()).toBe('Phase not found');
    expect(documentTitle()).toBe('Phase not found | Angular Learning Lab');
  });

  it('should show a lesson from the :phaseId and :lessonId parameters', async () => {
    await harness.navigateByUrl('/roadmap/phase-03/lessons/overview');
    expect(heading()).toBe('Lesson: overview');
    expect(harness.routeNativeElement?.querySelector('nav[aria-label="Breadcrumb"]')).toBeTruthy();
    expect(documentTitle()).toBe('Lesson: overview | Angular Learning Lab');
  });

  it('should show a not-found message for an unknown phase on the lesson route', async () => {
    await harness.navigateByUrl('/roadmap/phase-99/lessons/overview');
    expect(heading()).toBe('Lesson not found');
  });

  it('should show the not-found page for an unknown URL', async () => {
    await harness.navigateByUrl('/no/such/page');
    expect(heading()).toBe('Page not found');
    expect(documentTitle()).toBe('Page not found | Angular Learning Lab');
  });

  it('should open the phase page from a roadmap card link', async () => {
    await harness.navigateByUrl('/roadmap');
    const link = harness.routeNativeElement?.querySelector<HTMLAnchorElement>(
      'app-phase-card a[href="/roadmap/phase-02"]',
    );
    expect(link).toBeTruthy();
    link!.click();
    await harness.fixture.whenStable();
    expect(heading()).toBe('Create the app and project anatomy');
  });

  describe('when the language changes', () => {
    it('should re-render the page and the document title in Arabic', async () => {
      await harness.navigateByUrl('/roadmap/phase-03');
      TestBed.inject(I18nService).setLanguage('ar');
      await harness.fixture.whenStable();

      expect(heading()).toBe('المكوّنات والقوالب وتدفق التحكم');
      expect(documentTitle()).toBe('المكوّنات والقوالب وتدفق التحكم | مختبر أنجولار للتعلّم');
    });

    it('should show Arabic page titles for routes visited while in Arabic', async () => {
      TestBed.inject(I18nService).setLanguage('ar');

      await harness.navigateByUrl('/roadmap');
      expect(heading()).toBe('خارطة طريق التعلّم');
      expect(documentTitle()).toBe('خارطة طريق التعلّم | مختبر أنجولار للتعلّم');

      await harness.navigateByUrl('/no/such/page');
      expect(heading()).toBe('الصفحة غير موجودة');
    });
  });
});
