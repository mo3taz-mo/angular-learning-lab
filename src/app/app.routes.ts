import { ResolveFn, Routes } from '@angular/router';
import { findPhase } from './phases/phases.data';

const SITE_NAME = 'Angular Learning Lab';

const phaseTitle: ResolveFn<string> = (route) => {
  const phase = findPhase(route.paramMap.get('phaseId'));
  return `${phase?.title ?? 'Phase not found'} | ${SITE_NAME}`;
};

const lessonTitle: ResolveFn<string> = (route) => {
  return `Lesson: ${route.paramMap.get('lessonId')} | ${SITE_NAME}`;
};

export const routes: Routes = [
  {
    path: '',
    title: `Home | ${SITE_NAME}`,
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: 'roadmap',
    title: `Learning roadmap | ${SITE_NAME}`,
    loadComponent: () => import('./pages/roadmap-page/roadmap-page').then((m) => m.RoadmapPage),
  },
  {
    path: 'roadmap/:phaseId',
    title: phaseTitle,
    loadComponent: () => import('./pages/phase-page/phase-page').then((m) => m.PhasePage),
  },
  {
    path: 'roadmap/:phaseId/lessons/:lessonId',
    title: lessonTitle,
    loadComponent: () => import('./pages/lesson-page/lesson-page').then((m) => m.LessonPage),
  },
  {
    path: '**',
    title: `Page not found | ${SITE_NAME}`,
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
