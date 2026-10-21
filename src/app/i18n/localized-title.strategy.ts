import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Data,
  Params,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { ContentService } from '../content/content.service';
import { I18nService } from './i18n.service';

/** What a page title may depend on: the language and the loaded roadmap. */
export interface PageTitleContext {
  readonly i18n: I18nService;
  readonly content: ContentService;
}

export interface PageTitleRoute {
  readonly params: Params;
  readonly data: Data;
}

/** A route's page title. It may return '' while the roadmap is still loading. */
export type PageTitle = (context: PageTitleContext, route: PageTitleRoute) => string;

interface ActivePage {
  readonly pageTitle: PageTitle;
  readonly route: PageTitleRoute;
}

/**
 * Sets the document title from the deepest route's `data.pageTitle`. Because the title is computed
 * inside an effect, it is rebuilt when the language changes or the roadmap finishes loading, not
 * only when the route changes.
 */
@Injectable({ providedIn: 'root' })
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly context: PageTitleContext = {
    i18n: inject(I18nService),
    content: inject(ContentService),
  };
  private readonly activePage = signal<ActivePage | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const page = this.activePage();
      const siteName = this.context.i18n.t('site.name');
      const pageTitle = page ? page.pageTitle(this.context, page.route) : '';
      this.title.setTitle(pageTitle ? `${pageTitle} | ${siteName}` : siteName);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route: ActivatedRouteSnapshot | null = snapshot.root;
    let active: ActivePage | undefined;
    while (route) {
      const pageTitle = route.data['pageTitle'] as PageTitle | undefined;
      if (pageTitle) {
        active = { pageTitle, route: { params: route.params, data: route.data } };
      }
      route = route.firstChild;
    }
    this.activePage.set(active);
  }
}
