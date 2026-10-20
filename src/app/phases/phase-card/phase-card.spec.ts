import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Phase, PhaseStatus } from '../phase.model';
import { PhaseCard } from './phase-card';

const makePhase = (status: PhaseStatus): Phase => ({
  id: 'phase-x',
  title: 'Sample phase',
  summary: 'Sample summary',
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
    await TestBed.configureTestingModule({
      imports: [PhaseCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PhaseCard);
    element = fixture.nativeElement as HTMLElement;
  });

  it('should render the title and summary', async () => {
    await render(makePhase('planned'));
    expect(element.querySelector('h3')?.textContent).toContain('Sample phase');
    expect(element.textContent).toContain('Sample summary');
  });

  it.each([
    ['done', 'Done'],
    ['in-progress', 'In progress'],
    ['planned', 'Planned'],
  ] as const)('should show a text label for status %s', async (status, label) => {
    await render(makePhase(status));
    const statusText = element.querySelector('.phase-card__status')?.textContent?.trim();
    expect(statusText).toBe(label);
    expect(element.querySelector('article')?.getAttribute('data-status')).toBe(status);
  });
});
