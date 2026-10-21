import { TranslationKey } from './translations.en';

// Arabic UI strings. Every key of the English dictionary is required.
// Wording should be reviewed by a native Arabic speaker before publishing.
export const ar: Record<TranslationKey, string> = {
  'site.name': 'مختبر أنجولار للتعلّم',
  'site.tagline': 'رحلة تعلّم أنجولار خطوة بخطوة، يمكنك إعادة تنفيذها.',

  'nav.main': 'التنقل الرئيسي',
  'nav.home': 'الرئيسية',
  'nav.roadmap': 'خارطة الطريق',
  'nav.menu': 'القائمة',
  'nav.skip': 'التخطي إلى المحتوى الرئيسي',

  'lang.switchTo': 'التبديل إلى {language}',

  'theme.label': 'المظهر',
  'theme.light': 'فاتح',
  'theme.dark': 'داكن',
  'theme.system': 'حسب النظام',

  'home.intro': 'لكل مرحلة أوامر دقيقة ونتائج متوقعة وتمارين، لتتابع معنا وتصل إلى النتيجة نفسها.',
  'home.cta': 'استعرض خارطة طريق التعلّم',
  'home.features': 'ماذا ستجد هنا',
  'home.feature.practical.title': 'العملي أولاً',
  'home.feature.practical.body': 'لكل درس تمرين يمكن تشغيله أو التحقق منه.',
  'home.feature.reproducible.title': 'قابل لإعادة التنفيذ',
  'home.feature.reproducible.body': 'الأوامر والإصدارات والنتائج المتوقعة موثّقة.',
  'home.feature.bilingual.title': 'ثنائي اللغة',
  'home.feature.bilingual.body':
    'العربية والإنجليزية، مع تخطيط من اليمين إلى اليسار ومن اليسار إلى اليمين.',

  'roadmap.title': 'خارطة طريق التعلّم',
  'roadmap.listTitle': 'مراحل التعلّم',
  'roadmap.filter.label': 'تصفية المراحل حسب الحالة',
  'roadmap.filter.all': 'الكل',
  'roadmap.count': 'المعروض: {shown} من {total}',
  'roadmap.empty': 'لا توجد مراحل تطابق عامل التصفية المحدد.',

  'status.done': 'مكتملة',
  'status.in-progress': 'قيد التنفيذ',
  'status.planned': 'مخطط لها',

  'phase.back': 'العودة إلى خارطة الطريق',
  'phase.status': 'الحالة: {status}',
  'phase.lessons': 'الدروس',
  'phase.lessonsNote':
    'سيُضاف محتوى الدروس من ملفات Markdown. هذا الرابط الآن يوضّح المسار المتداخل فقط.',
  'phase.openOverview': 'افتح درس النظرة العامة (تجريبي)',
  'phase.notFound.title': 'المرحلة غير موجودة',
  'phase.notFound.body': 'لا توجد مرحلة بالمعرّف "{id}".',

  'lesson.breadcrumb': 'مسار التنقل',
  'lesson.title': 'الدرس: {id}',
  'lesson.placeholder': 'هذه صفحة مؤقتة. سيأتي محتوى الدروس من ملفات Markdown.',
  'lesson.notFound.title': 'الدرس غير موجود',

  'notFound.title': 'الصفحة غير موجودة',
  'notFound.body': 'الصفحة التي تبحث عنها غير موجودة.',
  'notFound.home': 'الذهاب إلى الصفحة الرئيسية',

  'footer.text': 'مشروع تعلّم علني. يُضاف المحتوى من ملفات Markdown.',
};
