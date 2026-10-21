import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PhaseStatus, PhaseSummary } from '../../content/content.model';
import { loadIndex } from '../../content/content.testing';
import { I18nService } from '../../i18n/i18n.service';
import { PhaseCard } from './phase-card';

const makePhase = (status: PhaseStatus, languages: PhaseSummary['languages'] = ['en', 'ar']) =>
  ({
    id: 'phase-x',
    order: 1,
    status,
    languages,
    title: { en: 'Sample phase', ar: 'مرحلة تجريبية' },
    summary: { en: 'Sample summary', ar: 'ملخص تجريبي' },
  }) satisfies PhaseSummary;

describe('PhaseCard', () => {
  let fixture: ComponentFixture<PhaseCard>;
  let element: HTMLElement;

  const render = async (phase: PhaseSummary) => {
    fixture.componentRef.setInput('phase', phase);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhaseCard],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    await loadIndex(); // the card reads titles through ContentService, which loads the roadmap
    fixture = TestBed.createComponent(PhaseCard);
    element = fixture.nativeElement as HTMLElement;
  });

  it('should render the title and summary', async () => {
    await render(makePhase('planned'));
    expect(element.querySelector('h3')?.textContent).toContain('Sample phase');
    expect(element.textContent).toContain('Sample summary');
  });

  it('should link the title to the phase details route', async () => {
    await render(makePhase('planned'));
    expect(element.querySelector('h3 a')?.getAttribute('href')).toBe('/roadmap/phase-x');
  });

  it.each([
    ['done', 'Done'],
    ['in-progress', 'In progress'],
    ['planned', 'Planned'],
  ] as const)('should show a text label for status %s', async (status, label) => {
    await render(makePhase(status));
    const statusText = element.querySelector('.phase-card__status')?.textContent?.trim();
    expect(statusText).toBe(label);
    expect(element.querySelector('mat-card')?.getAttribute('data-status')).toBe(status);
  });

  it('should render in Arabic when the language changes, without re-creating the card', async () => {
    await render(makePhase('done'));
    TestBed.inject(I18nService).setLanguage('ar');
    await fixture.whenStable();

    expect(element.querySelector('h3')?.textContent).toContain('مرحلة تجريبية');
    expect(element.textContent).toContain('ملخص تجريبي');
    expect(element.querySelector('.phase-card__status')?.textContent?.trim()).toBe('مكتملة');
  });

  it('should show the English text when the phase has no Arabic file', async () => {
    TestBed.inject(I18nService).setLanguage('ar');
    await render(makePhase('planned', ['en']));
    expect(element.querySelector('h3')?.textContent).toContain('Sample phase');
    expect(element.querySelector('.phase-card__status')?.textContent?.trim()).toBe('مخطط لها');
  });

  it('should mark the title and summary with the language and direction they are written in', async () => {
    const heading = () => element.querySelector('h3')!.parentElement!;

    await render(makePhase('done'));
    expect([heading().lang, heading().dir]).toEqual(['en', 'ltr']);

    TestBed.inject(I18nService).setLanguage('ar');
    await fixture.whenStable();
    expect([heading().lang, heading().dir]).toEqual(['ar', 'rtl']);

    // No Arabic file: the page is Arabic, but this text stays English and left-to-right.
    await render(makePhase('done', ['en']));
    expect([heading().lang, heading().dir]).toEqual(['en', 'ltr']);
  });
});
