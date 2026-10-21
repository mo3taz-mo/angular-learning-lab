import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PHASE_STATUS_KEYS, Section } from '../../content/content.model';
import { ContentService } from '../../content/content.service';
import { RenderedContent } from '../../content/rendered-content/rendered-content';
import { I18nService } from '../../i18n/i18n.service';
import { LANGUAGES } from '../../i18n/language';
import { TranslatePipe } from '../../i18n/translate.pipe';

@Component({
  imports: [
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RenderedContent,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
  ],
  selector: 'app-phase-page',
  styleUrl: './phase-page.css',
  templateUrl: './phase-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhasePage {
  // Both inputs are bound from the route by withComponentInputBinding(): `phaseId` from the
  // :phaseId parameter and `section` from the route's static data (learn or lesson).
  readonly phaseId = input.required<string>();
  readonly section = input.required<Section>();

  protected readonly content = inject(ContentService);
  protected readonly i18n = inject(I18nService);

  protected readonly phase = computed(() => this.content.find(this.phaseId()));
  protected readonly document = this.content.document(this.phaseId);

  /** Language and direction of the title, summary and content (may differ from the UI language). */
  protected readonly textLanguage = computed(() => {
    const phase = this.phase();
    return phase ? this.content.textLanguage(phase) : undefined;
  });

  protected readonly title = computed(() => {
    const phase = this.phase();
    return phase ? this.content.title(phase) : '';
  });
  protected readonly summary = computed(() => {
    const phase = this.phase();
    return phase ? this.content.summary(phase) : '';
  });
  protected readonly statusLabel = computed(() => {
    const phase = this.phase();
    return phase ? this.i18n.t(PHASE_STATUS_KEYS[phase.status]) : '';
  });

  /** Names of the requested and the shown language, when the shown one is a fallback. */
  protected readonly fallback = computed(() => {
    const phase = this.phase();
    if (!phase || !this.content.isFallback(phase)) {
      return null;
    }
    return {
      language: this.i18n.currentLanguage().nativeName,
      fallbackLanguage: LANGUAGES[this.content.languageFor(phase)].nativeName,
    };
  });

  protected readonly intro = computed(() =>
    this.document.hasValue() ? this.document.value().intro : null,
  );

  protected readonly sectionHtml = computed(() =>
    this.document.hasValue() ? this.document.value()[this.section()] : null,
  );
}
