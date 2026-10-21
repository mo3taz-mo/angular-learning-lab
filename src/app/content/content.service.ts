import { httpResource } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';
import { Lang, LANGUAGES, Language } from '../i18n/language';
import { ContentIndex, PhaseDocument, PhaseSummary } from './content.model';

/** Loads the roadmap and phase documents that the build script generated from docs/content. */
@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly i18n = inject(I18nService);

  /** The roadmap (every phase, already sorted by `order`). */
  readonly index = httpResource<ContentIndex>(() => 'content/index.json');

  readonly phases = computed<readonly PhaseSummary[]>(() =>
    this.index.hasValue() ? this.index.value().phases : [],
  );

  find(id: string | null | undefined): PhaseSummary | undefined {
    return this.phases().find((phase) => phase.id === id);
  }

  /**
   * The language to read a phase in: the active language when that file exists, otherwise English,
   * otherwise whatever language exists.
   */
  languageFor(phase: PhaseSummary): Lang {
    const wanted = this.i18n.lang();
    if (phase.languages.includes(wanted)) {
      return wanted;
    }
    return phase.languages.includes('en') ? 'en' : (phase.languages[0] ?? 'en');
  }

  /**
   * The language (code and direction) of a phase's text. When it differs from the UI language,
   * the text must be marked with its own `lang` and `dir` so punctuation, alignment and screen
   * reader pronunciation are right.
   */
  textLanguage(phase: PhaseSummary): Language {
    return LANGUAGES[this.languageFor(phase)];
  }

  title(phase: PhaseSummary): string {
    return phase.title[this.languageFor(phase)] ?? phase.id;
  }

  summary(phase: PhaseSummary): string {
    return phase.summary[this.languageFor(phase)] ?? '';
  }

  /** True when the phase has no file in the active language, so another language is shown. */
  isFallback(phase: PhaseSummary): boolean {
    return this.languageFor(phase) !== this.i18n.lang();
  }

  /**
   * A reactive resource for one phase's document. It waits for the roadmap (to know which
   * languages exist) and reloads when the id or the language changes. Call it in an injection
   * context, for example a component field initializer.
   */
  document(id: () => string | undefined) {
    return httpResource<PhaseDocument>(() => {
      const phase = this.find(id());
      return phase ? `content/${phase.id}.${this.languageFor(phase)}.json` : undefined;
    });
  }
}
