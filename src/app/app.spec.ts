import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes, withComponentInputBinding())],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the site name, a skip link and the main navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.app-header__title')?.textContent).toContain(
      'Angular Learning Lab',
    );
    expect(element.querySelector('.skip-link')?.textContent).toContain('Skip to main content');

    const links = Array.from(element.querySelectorAll('nav[aria-label="Main"] a'));
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Home', 'Roadmap']);
  });

  it('should mark the current page link with aria-current', async () => {
    const fixture = TestBed.createComponent(App);
    const element = fixture.nativeElement as HTMLElement;
    await TestBed.inject(Router).navigateByUrl('/roadmap');
    await fixture.whenStable();

    const current = element.querySelectorAll('nav[aria-label="Main"] a[aria-current="page"]');
    expect(current.length).toBe(1);
    expect(current[0].textContent?.trim()).toBe('Roadmap');
  });

  it('should move focus to the main content after a navigation', async () => {
    const fixture = TestBed.createComponent(App);
    const element = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/'); // initial navigation: focus is left alone
    await fixture.whenStable();
    expect(document.activeElement).not.toBe(element.querySelector('main'));

    await router.navigateByUrl('/roadmap');
    await fixture.whenStable();
    expect(document.activeElement).toBe(element.querySelector('main'));
  });

  it('should focus the main content when the skip link is activated', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLAnchorElement>('.skip-link')!.click();
    expect(document.activeElement).toBe(element.querySelector('main'));
  });
});
