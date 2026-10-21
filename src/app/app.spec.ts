import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { loadIndex } from './content/content.testing';
import { I18nService } from './i18n/i18n.service';
import { ThemeService } from './theme/theme.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    await loadIndex(); // navigations create the title strategy, which loads the roadmap
  });

  const mainNavLinks = (element: HTMLElement) =>
    Array.from(element.querySelectorAll('header nav a')).map((link) => link.textContent?.trim());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the site name, a skip link and the main navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.app-header__brand')?.textContent).toContain(
      'Angular Learning Lab',
    );
    expect(element.querySelector('.skip-link')?.textContent).toContain('Skip to main content');
    expect(element.querySelector('header nav')?.getAttribute('aria-label')).toBe('Main');
    expect(mainNavLinks(element)).toEqual(['Home', 'Roadmap']);
  });

  it('should render a footer', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).querySelector('footer')?.textContent).toContain(
      'learning-in-public',
    );
  });

  it('should mark the current page link with aria-current', async () => {
    const fixture = TestBed.createComponent(App);
    const element = fixture.nativeElement as HTMLElement;
    await TestBed.inject(Router).navigateByUrl('/roadmap');
    await fixture.whenStable();

    const current = element.querySelectorAll('header nav a[aria-current="page"]');
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

  it('should leave focus alone for a navigation that asks to keep it (the section tabs)', async () => {
    const fixture = TestBed.createComponent(App);
    const element = fixture.nativeElement as HTMLElement;
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    await fixture.whenStable();

    const brand = element.querySelector<HTMLAnchorElement>('.app-header__brand')!;
    brand.focus();
    await router.navigateByUrl('/roadmap', { state: { keepFocus: true } });
    await fixture.whenStable();
    expect(document.activeElement).toBe(brand);

    await router.navigateByUrl('/'); // a normal navigation moves focus again
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

  describe('language switcher', () => {
    const languageButton = (element: HTMLElement) =>
      element.querySelector<HTMLButtonElement>('.app-header__language')!;

    it('should offer the other language with an accessible name and a lang attribute', async () => {
      const fixture = TestBed.createComponent(App);
      await fixture.whenStable();
      const button = languageButton(fixture.nativeElement as HTMLElement);

      expect(button.textContent?.trim()).toBe('العربية');
      expect(button.getAttribute('lang')).toBe('ar');
      expect(button.getAttribute('aria-label')).toBe('Switch language to العربية');
    });

    it('should switch the whole UI to Arabic with RTL, and back to English with LTR', async () => {
      const fixture = TestBed.createComponent(App);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;
      const i18n = TestBed.inject(I18nService);

      languageButton(element).click();
      await fixture.whenStable();

      expect(i18n.lang()).toBe('ar');
      expect(document.documentElement.lang).toBe('ar');
      expect(document.documentElement.dir).toBe('rtl');
      expect(element.querySelector('.app')?.getAttribute('dir')).toBe('rtl');
      expect(mainNavLinks(element)).toEqual(['الرئيسية', 'خارطة الطريق']);
      expect(element.querySelector('.skip-link')?.textContent).toContain(
        'التخطي إلى المحتوى الرئيسي',
      );
      expect(languageButton(element).textContent?.trim()).toBe('English');
      expect(languageButton(element).getAttribute('lang')).toBe('en');

      languageButton(element).click();
      await fixture.whenStable();

      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
      expect(element.querySelector('.app')?.getAttribute('dir')).toBe('ltr');
      expect(mainNavLinks(element)).toEqual(['Home', 'Roadmap']);
    });
  });

  describe('theme switcher', () => {
    it('should list light, dark and system, and apply the chosen theme', async () => {
      const fixture = TestBed.createComponent(App);
      await fixture.whenStable();
      const element = fixture.nativeElement as HTMLElement;

      const themeButton = Array.from(
        element.querySelectorAll<HTMLButtonElement>('header button'),
      ).find((button) => button.textContent?.trim() === 'Theme')!;
      themeButton.click();
      await fixture.whenStable();

      const items = Array.from(
        document.querySelectorAll<HTMLButtonElement>('.mat-mdc-menu-panel [role="menuitemradio"]'),
      );
      expect(items.map((item) => item.textContent?.trim())).toEqual(['Light', 'Dark', 'System']);
      expect(items[2].getAttribute('aria-checked')).toBe('true');

      items[1].click();
      await fixture.whenStable();

      expect(TestBed.inject(ThemeService).mode()).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
