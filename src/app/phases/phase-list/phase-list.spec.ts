import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { Phase } from '../phase.model';
import { PhaseList } from './phase-list';

const phase = (id: string, title: string, status: Phase['status']): Phase => ({
  id,
  title: { en: title, ar: `${title} (ar)` },
  summary: { en: `${title} summary`, ar: `${title} summary (ar)` },
  status,
});

const PHASES: readonly Phase[] = [
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

  const render = async (phases: readonly Phase[]) => {
    fixture.componentRef.setInput('phases', phases);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhaseList],
      providers: [provideRouter([])],
    }).compileComponents();

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
      'No phases match this filter.',
    );
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
