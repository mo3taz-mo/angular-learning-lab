import { Routes } from '@angular/router';
import { PageTitle } from './i18n/localized-title.strategy';
import { findPhase } from './phases/phases.data';

// Page titles are functions so they can follow the active language; LocalizedTitleStrategy
// appends the site name and rebuilds the title when the language changes.
const homeTitle: PageTitle = (i18n) => i18n.t('nav.home');
const roadmapTitle: PageTitle = (i18n) => i18n.t('roadmap.title');
const notFoundTitle: PageTitle = (i18n) => i18n.t('notFound.title');

const phaseTitle: PageTitle = (i18n, params) => {
  const phase = findPhase(params['phaseId']);
  return phase ? i18n.pick(phase.title) : i18n.t('phase.notFound.title');
};

const lessonTitle: PageTitle = (i18n, params) => i18n.t('lesson.title', { id: params['lessonId'] });

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
  {
    path: 'roadmap/:phaseId',
    data: { pageTitle: phaseTitle },
    loadComponent: () => import('./pages/phase-page/phase-page').then((m) => m.PhasePage),
  },
  {
    path: 'roadmap/:phaseId/lessons/:lessonId',
    data: { pageTitle: lessonTitle },
    loadComponent: () => import('./pages/lesson-page/lesson-page').then((m) => m.LessonPage),
  },
  {
    path: '**',
    data: { pageTitle: notFoundTitle },
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
