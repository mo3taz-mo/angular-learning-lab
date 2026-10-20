import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('routes', () => {
  let harness: RouterTestingHarness;

  const heading = () => harness.routeNativeElement?.querySelector('h1')?.textContent?.trim();
  const documentTitle = () => TestBed.inject(Title).getTitle();

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
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
});
