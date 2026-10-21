import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Language } from '../../i18n/language';
import { TranslatePipe } from '../../i18n/translate.pipe';
import { TocEntry } from '../content.model';

/**
 * "On this page": the headings of the section being read. Choosing one is reported through
 * `select`; the page that owns the content scrolls to it and moves focus there.
 *
 * The entries are buttons, not links: a link would need an address that scrolls to the heading
 * when opened on its own, and this app does not read the URL fragment.
 */
@Component({
  imports: [TranslatePipe],
  selector: 'app-section-toc',
  styleUrl: './section-toc.css',
  templateUrl: './section-toc.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionToc {
  readonly entries = input.required<readonly TocEntry[]>();

  /** Language of the heading texts (they may differ from the UI language on a fallback page). */
  readonly language = input<Language>();

  /** Whether the list starts expanded; the user can always toggle it. */
  readonly open = input(false);

  readonly select = output<string>();
}
