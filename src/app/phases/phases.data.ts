import { Phase } from './phase.model';

// Temporary in-code data. It is replaced by content loaded from Markdown files.
export function findPhase(id: string | null | undefined): Phase | undefined {
  return PHASES.find((phase) => phase.id === id);
}

export const PHASES: readonly Phase[] = [
  {
    id: 'phase-00',
    title: { en: 'Environment and repository', ar: 'البيئة والمستودع' },
    summary: {
      en: 'Check Node.js, pnpm and the Angular CLI, and agree the project rules.',
      ar: 'التحقق من Node.js وpnpm وواجهة أنجولار الطرفية، والاتفاق على قواعد المشروع.',
    },
    status: 'done',
  },
  {
    id: 'phase-01',
    title: { en: 'TypeScript refresh', ar: 'مراجعة TypeScript' },
    summary: {
      en: 'Revisit the TypeScript features Angular code relies on.',
      ar: 'مراجعة ميزات TypeScript التي يعتمد عليها كود أنجولار.',
    },
    status: 'planned',
  },
  {
    id: 'phase-02',
    title: { en: 'Create the app and project anatomy', ar: 'إنشاء التطبيق وفهم بنية المشروع' },
    summary: {
      en: 'Generate the app with pnpm and learn what each generated file does.',
      ar: 'إنشاء التطبيق باستخدام pnpm وفهم وظيفة كل ملف تم توليده.',
    },
    status: 'done',
  },
  {
    id: 'phase-03',
    title: {
      en: 'Components, templates and control flow',
      ar: 'المكوّنات والقوالب وتدفق التحكم',
    },
    summary: {
      en: 'Build standalone components with signal inputs, signals and @for / @if / @switch.',
      ar: 'بناء مكوّنات مستقلة باستخدام مدخلات الإشارات والإشارات و@for و@if و@switch.',
    },
    status: 'done',
  },
  {
    id: 'phase-04',
    title: { en: 'Routing and layout shell', ar: 'التوجيه وهيكل التخطيط' },
    summary: {
      en: 'Add Home, Roadmap, Phase and Lesson routes with a shared layout.',
      ar: 'إضافة مسارات الرئيسية وخارطة الطريق والمراحل والدروس مع تخطيط مشترك.',
    },
    status: 'done',
  },
  {
    id: 'phase-05',
    title: {
      en: 'Design, responsive layout and Arabic/English (RTL/LTR)',
      ar: 'التصميم والتخطيط المتجاوب والعربية/الإنجليزية (RTL/LTR)',
    },
    summary: {
      en: 'Add Angular Material theming, light and dark modes, a responsive layout and a language switcher.',
      ar: 'إضافة سمات Angular Material والوضعين الفاتح والداكن وتخطيطًا متجاوبًا ومبدّل لغة.',
    },
    status: 'in-progress',
  },
  {
    id: 'phase-06',
    title: { en: 'Markdown content pipeline', ar: 'مسار محتوى Markdown' },
    summary: {
      en: 'Load roadmap, lessons and learn sections from Markdown files without code changes.',
      ar: 'تحميل خارطة الطريق والدروس وأقسام التعلّم من ملفات Markdown دون تعديل الكود.',
    },
    status: 'planned',
  },
  {
    id: 'phase-07',
    title: {
      en: 'Lesson pages, search and code snippets',
      ar: 'صفحات الدروس والبحث ومقاطع الكود',
    },
    summary: {
      en: 'Render lessons, add search and filtering, and add copy buttons for code.',
      ar: 'عرض الدروس وإضافة البحث والتصفية وأزرار نسخ الكود.',
    },
    status: 'planned',
  },
  {
    id: 'phase-08',
    title: {
      en: 'Accessibility pass and test coverage',
      ar: 'مراجعة إمكانية الوصول وتغطية الاختبارات',
    },
    summary: {
      en: 'Check keyboard use, focus, contrast and screen readers, and fill test gaps.',
      ar: 'فحص استخدام لوحة المفاتيح والتركيز والتباين وقارئات الشاشة، وسدّ فجوات الاختبار.',
    },
    status: 'planned',
  },
  {
    id: 'phase-09',
    title: { en: 'Production build and publishing', ar: 'البناء للإنتاج والنشر' },
    summary: {
      en: 'Build for production, set up hosting with SPA fallback, and polish the docs.',
      ar: 'البناء للإنتاج وإعداد الاستضافة مع إعادة التوجيه لصفحة التطبيق، وتحسين الوثائق.',
    },
    status: 'planned',
  },
];
