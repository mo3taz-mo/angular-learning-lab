// Test helpers: sample content in the shape the build script produces, and a function that answers
// the app's HTTP requests like the dev server would. Used only by *.spec.ts files.
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { Lang } from '../i18n/language';
import { ContentIndex, PhaseDocument } from './content.model';
import { ContentService } from './content.service';

export const ENV_ID = 'phase-00-env';
export const TS_ID = 'phase-01-ts';
export const APP_ID = 'phase-02-app';

export const INDEX_FIXTURE: ContentIndex = {
  phases: [
    {
      id: ENV_ID,
      order: 0,
      status: 'done',
      languages: ['en', 'ar'],
      title: { en: 'Environment', ar: 'البيئة' },
      summary: { en: 'Check the tools.', ar: 'التحقق من الأدوات.' },
    },
    {
      id: TS_ID,
      order: 1,
      status: 'planned',
      languages: ['en'],
      title: { en: 'TypeScript refresh' },
      summary: { en: 'Revisit TypeScript.' },
    },
    {
      id: APP_ID,
      order: 2,
      status: 'in-progress',
      languages: ['en', 'ar'],
      title: { en: 'Create the app', ar: 'إنشاء التطبيق' },
      summary: { en: 'Generate the app.', ar: 'إنشاء التطبيق.' },
    },
  ],
};

export function documentFixture(id: string, lang: Lang): PhaseDocument {
  const summary = INDEX_FIXTURE.phases.find((phase) => phase.id === id)!;
  const empty = id === TS_ID;
  return {
    id,
    lang,
    title: summary.title[lang] ?? '',
    summary: summary.summary[lang] ?? '',
    order: summary.order,
    status: summary.status,
    intro: empty ? null : `<blockquote><p>Goal (${lang})</p></blockquote>`,
    learn: empty
      ? null
      : `<h2 id="rules">Rules</h2><p>Learn text (${lang})</p><h2 id="tools">Tools</h2><p>More text</p>`,
    lesson: empty
      ? null
      : `<h3 id="step-1">Step 1</h3><pre class="code-block" dir="ltr"><code>node --version</code></pre><ul class="task-list"><li class="task-list-item"><input class="task-checkbox" type="checkbox" disabled> Done it</li></ul>`,
    toc: empty
      ? { learn: [], lesson: [] }
      : {
          learn: [
            { level: 2, id: 'rules', text: 'Rules' },
            { level: 2, id: 'tools', text: 'Tools' },
          ],
          lesson: [{ level: 3, id: 'step-1', text: 'Step 1' }],
        },
  };
}

/**
 * Lets pending work finish and updates the views. ApplicationRef.whenStable() cannot be used when
 * another request may still be open (it waits for every in-flight request, and the test's fake
 * backend answers only when told to), so this yields to the event loop and ticks instead.
 */
export async function settle(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
  TestBed.tick();
}

/** Resolves at the next completed navigation. Create it before the action that navigates. */
export function navigated(): Promise<unknown> {
  return firstValueFrom(
    TestBed.inject(Router).events.pipe(filter((event) => event instanceof NavigationEnd)),
  ).then(settle);
}

/** Answers one pending request (after letting the app's effects issue it), then updates the UI. */
export async function respond(url: string, body: object | null, status = 200): Promise<void> {
  TestBed.tick();
  const request = TestBed.inject(HttpTestingController).expectOne(url);
  if (status === 200) {
    request.flush(body);
  } else {
    request.flush('error', { status, statusText: 'Server error' });
  }
  await settle();
}

/** Creates the content service and answers its roadmap request, for specs that do not test it. */
export async function loadIndex(): Promise<void> {
  TestBed.inject(ContentService);
  await respondWithIndex();
}

export function respondWithIndex(): Promise<void> {
  return respond('content/index.json', INDEX_FIXTURE);
}

export function respondWithDocument(id: string, lang: Lang): Promise<void> {
  return respond(`content/${id}.${lang}.json`, documentFixture(id, lang));
}
