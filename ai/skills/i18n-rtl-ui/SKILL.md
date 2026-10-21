---
name: i18n-rtl-ui
description: Implement and review Arabic/English localization with correct RTL/LTR direction, accessible language switching, and direction-independent styling.
---

# Arabic/English and RTL/LTR Skill

1. Treat Arabic and English as first-class locales, not an afterthought.
2. Keep translated UI strings out of templates when practical; use the project's chosen localization/content model consistently.
3. Set the document language and direction when locale changes: Arabic uses `lang="ar"` and `dir="rtl"`; English uses `lang="en"` and `dir="ltr"`.
4. Use CSS logical properties (`margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`) instead of hardcoded left/right when layout direction should adapt.
5. Check icons, breadcrumbs, menus, pagination, code samples, form labels, validation messages, and mixed Arabic/English text in both directions.
6. Keep code snippets and terminal commands readable in both locales; isolate direction-sensitive snippets when needed.
7. Ensure the language switcher is keyboard-accessible and has an accessible name.
8. Test at narrow and wide viewports and verify that switching language does not break layout.
9. Do not claim full RTL support based only on setting the `dir` attribute; visually verify the components.
10. Project setup: UI strings live in typed dictionaries (`src/app/i18n/translations.en.ts` and `translations.ar.ts`); a missing Arabic key is a compile error. Use the `t` pipe for UI text and the `localized` pipe for bilingual content. `I18nService` sets `lang` and `dir` on `<html>` and persists the choice. Page titles follow the language through `LocalizedTitleStrategy`.
