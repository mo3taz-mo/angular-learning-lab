import { TestBed } from '@angular/core/testing';
import { I18nService } from '../../i18n/i18n.service';
import { TocEntry } from '../content.model';
import { SectionToc } from './section-toc';

const ENTRIES: readonly TocEntry[] = [
  { level: 2, id: 'rules', text: 'Rules' },
  { level: 3, id: 'step-1', text: 'Step 1' },
];

describe('SectionToc', () => {
  const render = async (entries: readonly TocEntry[] = ENTRIES) => {
    localStorage.clear();
    const fixture = TestBed.createComponent(SectionToc);
    fixture.componentRef.setInput('entries', entries);
    await fixture.whenStable();
    return fixture;
  };

  it('should list every heading as a button inside a labelled navigation', async () => {
    const fixture = await render();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('nav')?.getAttribute('aria-label')).toBe('On this page');
    const buttons = Array.from(element.querySelectorAll('button'));
    expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Rules', 'Step 1']);
    expect(buttons.every((button) => button.type === 'button')).toBe(true);
  });

  it('should indent the third-level headings', async () => {
    const fixture = await render();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items[0].classList.contains('toc__item--sub')).toBe(false);
    expect(items[1].classList.contains('toc__item--sub')).toBe(true);
  });

  it('should report the chosen heading', async () => {
    const fixture = await render();
    const chosen: string[] = [];
    fixture.componentInstance.select.subscribe((id) => chosen.push(id));

    (fixture.nativeElement as HTMLElement).querySelectorAll('button')[1].click();

    expect(chosen).toEqual(['step-1']);
  });

  it('should start collapsed unless told to open', async () => {
    const fixture = await render();
    const details = (fixture.nativeElement as HTMLElement).querySelector('details')!;
    expect(details.open).toBe(false);

    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    expect(details.open).toBe(true);
  });

  it('should mark the headings with their own language and direction', async () => {
    const fixture = await render();
    fixture.componentRef.setInput('language', { code: 'en', nativeName: 'English', dir: 'ltr' });
    TestBed.inject(I18nService).setLanguage('ar');
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const list = element.querySelector('ol')!;
    expect([list.lang, list.dir]).toEqual(['en', 'ltr']);
    expect(element.querySelector('summary')?.textContent?.trim()).toBe('في هذه الصفحة');
  });
});
