import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PhaseStatus, PhaseSummary } from '../../content/content.model';
import { loadIndex } from '../../content/content.testing';
import { I18nService } from '../../i18n/i18n.service';
import { PhaseList } from './phase-list';

const phase = (id: string, title: string, status: PhaseStatus): PhaseSummary => ({
  id,
  order: 0,
  status,
  languages: ['en', 'ar'],
  title: { en: title, ar: `${title} (ar)` },
  summary: { en: `${title} summary`, ar: `${title} summary (ar)` },
});

const PHASES: readonly PhaseSummary[] = [
  phase('a', 'Alpha', 'done'),
  phase('b', 'Beta', 'in-progress'),
  phase('c', 'Gamma', 'planned'),
  phase('d', 'Delta', 'planned'),
];

describe('PhaseList', () => {
  let fixture: ComponentFixture<PhaseList>;
  let element: HTMLElement;

  const cardTitles = () =>
    Array.from(element.querySelectorAll('app-phase-card h3')).map((h) => h.textContent?.trim());

  const toggle = (label: string) =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('mat-button-toggle button')).find(
      (button) => button.textContent?.trim() === label,
    )!;

  const render = async (phases: readonly PhaseSummary[]) => {
    fixture.componentRef.setInput('phases', phases);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhaseList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    await loadIndex(); // the cards read titles through ContentService, which loads the roadmap
    fixture = TestBed.createComponent(PhaseList);
    element = fixture.nativeElement as HTMLElement;
  });

  it('should show every phase by default', async () => {
    await render(PHASES);
    expect(cardTitles()).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta']);
    expect(toggle('All').getAttribute('aria-checked')).toBe('true');
    expect(element.querySelector('.phase-list__count')?.textContent).toContain(
      'Showing 4 of 4 phases',
    );
  });

  it('should label the filter group for assistive technology', async () => {
    await render(PHASES);
    expect(element.querySelector('mat-button-toggle-group')?.getAttribute('aria-label')).toBe(
      'Filter phases by status',
    );
  });

  it('should filter by status when a filter is chosen', async () => {
    await render(PHASES);

    toggle('Planned').click();
    await fixture.whenStable();

    expect(cardTitles()).toEqual(['Gamma', 'Delta']);
    expect(toggle('Planned').getAttribute('aria-checked')).toBe('true');
    expect(toggle('All').getAttribute('aria-checked')).toBe('false');
    expect(element.querySelector('.phase-list__count')?.textContent).toContain(
      'Showing 2 of 4 phases',
    );
  });

  it('should show the empty message when no phase matches', async () => {
    await render([phase('a', 'Alpha', 'done')]);

    toggle('Planned').click();
    await fixture.whenStable();

    expect(cardTitles()).toEqual([]);
    expect(element.querySelector('.phase-list__empty')?.textContent).toContain(
      'No phases match your search or filter.',
    );
  });

  describe('search', () => {
    const search = async (text: string) => {
      const input = element.querySelector<HTMLInputElement>('input[type="search"]')!;
      input.value = text;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };

    it('should have an accessible name', async () => {
      await render(PHASES);
      expect(element.querySelector('mat-label')?.textContent?.trim()).toBe('Search phases');
    });

    it('should match the title regardless of case', async () => {
      await render(PHASES);
      await search('  BET ');
      expect(cardTitles()).toEqual(['Beta']);
      expect(element.querySelector('.phase-list__count')?.textContent).toContain(
        'Showing 1 of 4 phases',
      );
    });

    it('should match the summary and require every word', async () => {
      await render(PHASES);
      await search('gamma summary');
      expect(cardTitles()).toEqual(['Gamma']);
      await search('gamma delta');
      expect(cardTitles()).toEqual([]);
    });

    it('should ignore accents', async () => {
      await render([phase('a', 'Café basics', 'done'), phase('b', 'Other', 'done')]);
      await search('cafe');
      expect(cardTitles()).toEqual(['Café basics']);
    });

    it('should combine with the status filter', async () => {
      await render(PHASES);
      toggle('Planned').click();
      await fixture.whenStable();
      await search('delta');
      expect(cardTitles()).toEqual(['Delta']);
      await search('alpha');
      expect(cardTitles()).toEqual([]);
      expect(element.querySelector('.phase-list__empty')?.textContent).toContain(
        'No phases match your search or filter.',
      );
    });

    it('should show everything again when the search is cleared', async () => {
      await render(PHASES);
      await search('alpha');
      await search('');
      expect(cardTitles()).toHaveLength(4);
    });

    it('should search the titles of the active language, ignoring Arabic diacritics', async () => {
      const setup: PhaseSummary = {
        ...phase('s', 'Setup', 'done'),
        title: { en: 'Setup', ar: 'التَّهيئة' },
      };
      await render([setup, phase('b', 'Beta', 'done')]);
      TestBed.inject(I18nService).setLanguage('ar');
      await fixture.whenStable();

      await search('التهيئة');
      expect(cardTitles()).toEqual(['التَّهيئة']);
    });
  });

  it('should translate the filters, count and cards when the language changes', async () => {
    await render(PHASES);
    TestBed.inject(I18nService).setLanguage('ar');
    await fixture.whenStable();

    expect(toggle('الكل')).toBeTruthy();
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('مراحل التعلّم');
    expect(element.querySelector('.phase-list__count')?.textContent?.trim()).toBe(
      'المعروض: 4 من 4',
    );
    expect(cardTitles()[0]).toBe('Alpha (ar)');
  });
});
