---
name: material-ui
description: Build accessible, responsive Angular UI with Angular Material and the CDK, using the Material 3 theming API and RTL/LTR-safe patterns.
---

# Angular Material UI Skill

The project uses Angular Material + CDK (MIT). PrimeNG is not used: PrimeNG 22 is under the PrimeUI License (license key), which does not fit a public, reproducible repository.

1. Keep `@angular/material` and `@angular/cdk` at the same version as `@angular/core`. Verify with `npm view` and the official Material guides before installing or upgrading.
2. Use pnpm only. Install with `pnpm add`; do not run `ng add @angular/material`, because it adds Google-hosted font and icon links to `index.html`.
3. Theme through the Material 3 `mat.theme` Sass mixin in `src/styles.scss`. Components read `--mat-sys-*` tokens and the app's `--app-*` aliases; never hardcode colors.
4. Switch light/dark with `color-scheme` (the `data-theme` attribute on `<html>`, set by `ThemeService`); do not add a second theming mechanism.
5. Import only the Material components actually used, as standalone imports (`MatButton`, `MatMenu`, ...).
6. Prefer semantic HTML, accessible names, keyboard behavior, visible focus, and appropriate ARIA. Do not rely on color alone.
7. No external fonts or icon fonts. Use system fonts (they cover Arabic) and text labels, or inline SVG icons you control.
8. RTL: `Directionality.change` does not fire for `dir` changes made only on `<html>`. Keep the `[dir]` directive on the app root bound to the language so Material menus, selects and overlays follow the direction. Use CSS logical properties everywhere.
9. Check components in Arabic RTL and English LTR, light and dark, at phone, tablet and desktop widths, including menus and overlays. Do not claim RTL/responsive support from the `dir` attribute or from tests alone.
10. Add tests for meaningful interactions and document the setup in the active phase guide.
11. Do not mix in another component library without the project owner's approval.
