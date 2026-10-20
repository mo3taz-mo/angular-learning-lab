import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Phase } from '../phase.model';
import { PhaseList } from './phase-list';

const PHASES: readonly Phase[] = [
  { id: 'a', title: 'Alpha', summary: 'First', status: 'done' },
  { id: 'b', title: 'Beta', summary: 'Second', status: 'in-progress' },
  { id: 'c', title: 'Gamma', summary: 'Third', status: 'planned' },
  { id: 'd', title: 'Delta', summary: 'Fourth', status: 'planned' },
];

describe('PhaseList', () => {
  let fixture: ComponentFixture<PhaseList>;
  let element: HTMLElement;

  const cardTitles = () =>
    Array.from(element.querySelectorAll('app-phase-card h3')).map((h) => h.textContent?.trim());

  const filterButton = (label: string) =>
    Array.from(element.querySelectorAll<HTMLButtonElement>('.phase-list__filter')).find(
      (button) => button.textContent?.trim() === label,
    )!;

  const render = async (phases: readonly Phase[]) => {
    fixture.componentRef.setInput('phases', phases);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhaseList],
    }).compileComponents();

    fixture = TestBed.createComponent(PhaseList);
    element = fixture.nativeElement as HTMLElement;
  });

  it('should show every phase by default', async () => {
    await render(PHASES);
    expect(cardTitles()).toEqual(['Alpha', 'Beta', 'Gamma', 'Delta']);
    expect(filterButton('All').getAttribute('aria-pressed')).toBe('true');
    expect(element.querySelector('.phase-list__count')?.textContent).toContain(
      'Showing 4 of 4 phases',
    );
  });

  it('should filter by status when a filter button is clicked', async () => {
    await render(PHASES);

    filterButton('Planned').click();
    await fixture.whenStable();

    expect(cardTitles()).toEqual(['Gamma', 'Delta']);
    expect(filterButton('Planned').getAttribute('aria-pressed')).toBe('true');
    expect(filterButton('All').getAttribute('aria-pressed')).toBe('false');
    expect(element.querySelector('.phase-list__count')?.textContent).toContain(
      'Showing 2 of 4 phases',
    );
  });

  it('should show the empty message when no phase matches', async () => {
    await render([{ id: 'a', title: 'Alpha', summary: 'First', status: 'done' }]);

    filterButton('Planned').click();
    await fixture.whenStable();

    expect(cardTitles()).toEqual([]);
    expect(element.querySelector('.phase-list__empty')?.textContent).toContain(
      'No phases match this filter.',
    );
  });
});
