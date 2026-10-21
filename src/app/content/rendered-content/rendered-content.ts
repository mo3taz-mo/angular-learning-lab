import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Language } from '../../i18n/language';

/**
 * Shows the HTML that scripts/build-content.mjs produced from a Markdown file.
 *
 * Why this bypasses Angular's HTML sanitizer: the sanitizer would remove things the content needs
 * (heading ids, `dir` on code blocks, the read-only checkboxes of task lists, `tabindex` on
 * scrollable tables). The HTML is not user input. It is generated at build time from files in this
 * repository by a renderer that does not allow raw HTML and rejects `javascript:` links, and
 * scripts/content/content.test.mjs checks both. Never pass any other HTML to this component.
 *
 * Encapsulation is off because the markup lives inside [innerHTML], where component-scoped styles
 * cannot reach; every rule in the stylesheet is prefixed with `.rendered-content`.
 */
@Component({
  selector: 'app-rendered-content',
  styleUrl: './rendered-content.css',
  template:
    '<div class="rendered-content" [attr.lang]="language()?.code" [attr.dir]="language()?.dir" [innerHTML]="trusted()"></div>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderedContent {
  readonly html = input.required<string>();

  /** The language of the content, so it is read and laid out correctly inside any page. */
  readonly language = input<Language>();

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly trusted = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.html()));
}
