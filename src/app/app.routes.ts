import { CanMatchFn, Routes } from '@angular/router';
import { isSection } from './content/content.model';
import { PageTitle } from './i18n/localized-title.strategy';

// Page titles are functions so they can follow the active language and the loaded roadmap;
// LocalizedTitleStrategy appends the site name and rebuilds the title when either changes.
const homeTitle: PageTitle = ({ i18n }) => i18n.t('nav.home');
const roadmapTitle: PageTitle = ({ i18n }) => i18n.t('roadmap.title');
const notFoundTitle: PageTitle = ({ i18n }) => i18n.t('notFound.title');

const phaseTitle: PageTitle = ({ i18n, content }, { params }) => {
  if (!content.index.hasValue()) {
    return ''; // still loading, or it failed: only the site name until we know
  }
  const phase = content.find(params['phaseId']);
  if (!phase) {
    return i18n.t('phase.notFound.title');
  }
  const section = params['section'] === 'lesson' ? 'phase.tab.lesson' : 'phase.tab.learn';
  return `${content.title(phase)} - ${i18n.t(section)}`;
};

// Only /roadmap/<phase>/learn and /roadmap/<phase>/lesson match; anything else falls through to
// the not-found page.
const isSectionUrl: CanMatchFn = (_route, segments) =>
  segments.length === 3 && isSection(segments[2].path);

export const routes: Routes = [
  {
    path: '',
    data: { pageTitle: homeTitle },
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'roadmap',
    data: { pageTitle: roadmapTitle },
    loadComponent: () => import('./pages/roadmap-page/roadmap-page').then((m) => m.RoadmapPage),
  },
  // A phase has two sections, Learn and Lesson, each with its own address. One route serves both,
  // so switching sections reuses the page instead of recreating it. `phaseId` and `section` are
  // bound to the page's inputs by withComponentInputBinding().
  {
    path: 'roadmap/:phaseId/:section',
    canMatch: [isSectionUrl],
    data: { pageTitle: phaseTitle },
    loadComponent: () => import('./pages/phase-page/phase-page').then((m) => m.PhasePage),
  },
  {
    path: 'roadmap/:phaseId',
    pathMatch: 'full',
    redirectTo: ({ params }) => `/roadmap/${params['phaseId']}/learn`,
  },
  {
    path: '**',
    data: { pageTitle: notFoundTitle },
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
