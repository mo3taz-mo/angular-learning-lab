// English UI strings. The keys of this object define the TranslationKey type; the Arabic
// dictionary must provide every key, so a missing translation is a compile error.
// Lesson and roadmap content is not here: it comes from the Markdown files in docs/content.
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
  'roadmap.search.label': 'Search phases',
  'roadmap.empty': 'No phases match your search or filter.',
  'roadmap.noPhases': 'No phases have been published yet.',

  'status.done': 'Done',
  'status.in-progress': 'In progress',
  'status.planned': 'Planned',

  'content.loading': 'Loading…',
  'content.error': 'The content could not be loaded. Check your connection and reload the page.',
  'content.fallback': 'This page is not available in {language} yet. Showing {fallbackLanguage}.',

  'phase.back': 'Back to the roadmap',
  'phase.status': 'Status: {status}',
  'phase.tabs.label': 'Phase sections',
  'phase.tab.learn': 'Learn',
  'phase.tab.lesson': 'Lesson',
  'phase.section.empty': 'This section has no content yet.',
  'toc.title': 'On this page',

  'code.copy': 'Copy code',
  'code.copied': 'Copied',
  'code.copiedAnnounce': 'Code copied to the clipboard.',
  'code.copyFailed': 'Copying failed. The code is selected, press Ctrl+C to copy it.',

  'phase.notFound.title': 'Phase not found',
  'phase.notFound.body': 'There is no phase with the id "{id}".',

  'notFound.title': 'Page not found',
  'notFound.body': 'The page you are looking for does not exist.',
  'notFound.home': 'Go to the home page',

  'footer.text': 'A learning-in-public project. Content is added from Markdown files.',
};

export type TranslationKey = keyof typeof en;
