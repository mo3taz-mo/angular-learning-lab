// English UI strings. The keys of this object define the TranslationKey type; the Arabic
// dictionary must provide every key, so a missing translation is a compile error.
export const en = {
  'site.name': 'Angular Learning Lab',
  'site.tagline': 'A step-by-step Angular learning journey you can reproduce.',

  'nav.main': 'Main',
  'nav.home': 'Home',
  'nav.roadmap': 'Roadmap',
  'nav.menu': 'Menu',
  'nav.skip': 'Skip to main content',

  'lang.switchTo': 'Switch language to {language}',

  'theme.label': 'Theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'System',

  'home.intro':
    'Every phase has exact commands, expected results, and exercises, so you can follow along and get the same result.',
  'home.cta': 'View the learning roadmap',
  'home.features': 'What you will find here',
  'home.feature.practical.title': 'Practical first',
  'home.feature.practical.body': 'Every lesson has a runnable or verifiable exercise.',
  'home.feature.reproducible.title': 'Reproducible',
  'home.feature.reproducible.body': 'Commands, versions and expected results are documented.',
  'home.feature.bilingual.title': 'Bilingual',
  'home.feature.bilingual.body':
    'Arabic and English, with right-to-left and left-to-right layouts.',

  'roadmap.title': 'Learning roadmap',
  'roadmap.listTitle': 'Learning phases',
  'roadmap.filter.label': 'Filter phases by status',
  'roadmap.filter.all': 'All',
  'roadmap.count': 'Showing {shown} of {total} phases',
  'roadmap.empty': 'No phases match this filter.',

  'status.done': 'Done',
  'status.in-progress': 'In progress',
  'status.planned': 'Planned',

  'phase.back': 'Back to the roadmap',
  'phase.status': 'Status: {status}',
  'phase.lessons': 'Lessons',
  'phase.lessonsNote':
    'Lesson content will be added from Markdown files. For now, this link only demonstrates a nested route.',
  'phase.openOverview': 'Open the overview lesson (placeholder)',
  'phase.notFound.title': 'Phase not found',
  'phase.notFound.body': 'There is no phase with the id "{id}".',

  'lesson.breadcrumb': 'Breadcrumb',
  'lesson.title': 'Lesson: {id}',
  'lesson.placeholder': 'This is a placeholder. Lesson content will come from Markdown files.',
  'lesson.notFound.title': 'Lesson not found',

  'notFound.title': 'Page not found',
  'notFound.body': 'The page you are looking for does not exist.',
  'notFound.home': 'Go to the home page',

  'footer.text': 'A learning-in-public project. Content is added from Markdown files.',
};

export type TranslationKey = keyof typeof en;
