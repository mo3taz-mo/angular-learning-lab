import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { I18nService } from '../../i18n/i18n.service';
import { Language } from '../../i18n/language';

const COPIED_LABEL_MS = 2000;

/**
 * Shows the HTML that scripts/build-content.mjs produced from a Markdown file.
 *
 * Why this bypasses Angular's HTML sanitizer: the sanitizer would remove things the content needs
 * (heading ids, `dir` on code blocks, the read-only checkboxes of task lists, `tabindex` on
 * scrollable tables). The HTML is not user input. It is generated at build time from files in this
 * repository by a renderer that does not allow raw HTML and rejects `javascript:` links, and
 * scripts/content/content.test.mjs checks both. Never pass any other HTML to this component.
 *
 * After each render it wraps every code block in a small bar with the language name and a copy
 * button. The bar is built with DOM calls and `textContent` only, never with HTML strings.
 *
 * Encapsulation is off because the markup lives inside [innerHTML], where component-scoped styles
 * cannot reach; every rule in the stylesheet is prefixed with `.rendered-content`.
 */
@Component({
  selector: 'app-rendered-content',
  styleUrl: './rendered-content.css',
  template: `
    <div
      #content
      class="rendered-content"
      [attr.lang]="language()?.code"
      [attr.dir]="language()?.dir"
      [innerHTML]="trusted()"
      (click)="onClick($event)"
    ></div>
    <p class="rendered-content-status" role="status">{{ announcement() }}</p>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderedContent {
  readonly html = input.required<string>();

  /** The language of the content, so it is read and laid out correctly inside any page. */
  readonly language = input<Language>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly i18n = inject(I18nService);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly trusted = computed(() => this.sanitizer.bypassSecurityTrustHtml(this.html()));

  /** Spoken (not shown) result of the last copy attempt. */
  protected readonly announcement = signal('');

  private resetTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    // Runs after every render in which the HTML or the UI language changed.
    afterRenderEffect(() => {
      this.html();
      this.i18n.lang();
      this.addCopyBars(this.content().nativeElement);
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
  }

  protected onClick(event: Event): void {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('.copy-button');
    const code = button?.closest('.code-wrap')?.querySelector('pre code');
    if (button && code) {
      void this.copy(button, code);
    }
  }

  private addCopyBars(root: HTMLElement): void {
    for (const pre of Array.from(root.querySelectorAll<HTMLElement>('pre.code-block'))) {
      if (!pre.parentElement?.classList.contains('code-wrap')) {
        this.wrap(pre);
      }
    }
    // Labels follow the UI language, which can change without the content changing.
    for (const bar of Array.from(root.querySelectorAll<HTMLElement>('.code-bar'))) {
      bar.dir = this.i18n.dir();
      const button = bar.querySelector<HTMLButtonElement>('.copy-button');
      if (button) {
        button.lang = this.i18n.lang();
        button.textContent = this.i18n.t('code.copy');
      }
    }
  }

  private wrap(pre: HTMLElement): void {
    const doc = pre.ownerDocument;
    const wrap = doc.createElement('div');
    wrap.className = 'code-wrap';

    const bar = doc.createElement('div');
    bar.className = 'code-bar';

    const name = pre.querySelector('code')?.className.match(/(?:^|\s)language-([\w+#.-]+)/)?.[1];
    const language = doc.createElement('span');
    language.className = 'code-language';
    language.dir = 'ltr';
    language.textContent = name ?? '';

    const button = doc.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';

    bar.append(language, button);
    pre.replaceWith(wrap);
    wrap.append(bar, pre);
  }

  private async copy(button: HTMLButtonElement, code: Element): Promise<void> {
    // The build script ends every block with a newline; a pasted command should not.
    const text = (code.textContent ?? '').replace(/\n$/, '');
    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      // No clipboard access (insecure page, denied permission): select the code instead so the
      // keyboard shortcut works.
      const selection = window.getSelection();
      selection?.removeAllRanges();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection?.addRange(range);
    }

    this.announcement.set(this.i18n.t(copied ? 'code.copiedAnnounce' : 'code.copyFailed'));
    if (copied) {
      button.textContent = this.i18n.t('code.copied');
      clearTimeout(this.resetTimer);
      this.resetTimer = setTimeout(() => {
        button.textContent = this.i18n.t('code.copy');
        this.announcement.set('');
      }, COPIED_LABEL_MS);
    }
  }
}
