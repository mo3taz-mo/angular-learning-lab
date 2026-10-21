import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { I18nService } from '../../i18n/i18n.service';
import { Phase, PhaseStatus } from '../phase.model';
import { PhaseCard } from './phase-card';

const makePhase = (status: PhaseStatus): Phase => ({
  id: 'phase-x',
  title: { en: 'Sample phase', ar: 'مرحلة تجريبية' },
  summary: { en: 'Sample summary', ar: 'ملخص تجريبي' },
  status,
});

describe('PhaseCard', () => {
  let fixture: ComponentFixture<PhaseCard>;
  let element: HTMLElement;

  const render = async (phase: Phase) => {
    fixture.componentRef.setInput('phase', phase);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PhaseCard],
      providers: [provideRouter([])],
    }).compileComponents();

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
});
