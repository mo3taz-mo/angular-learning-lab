import { effect, inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Params,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';
import { I18nService } from './i18n.service';

/** A route's page title, computed from the language and the route parameters. */
export type PageTitle = (i18n: I18nService, params: Params) => string;

interface ActivePage {
  readonly pageTitle: PageTitle;
  readonly params: Params;
}

/**
 * Sets the document title from the deepest route's `data.pageTitle`. Because the title is computed
 * inside an effect, it is rebuilt when the language changes, not only when the route changes.
 */
@Injectable({ providedIn: 'root' })
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18n = inject(I18nService);
  private readonly activePage = signal<ActivePage | undefined>(undefined);

  constructor() {
    super();
    effect(() => {
      const page = this.activePage();
      const siteName = this.i18n.t('site.name');
      this.title.setTitle(
        page ? `${page.pageTitle(this.i18n, page.params)} | ${siteName}` : siteName,
      );
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route: ActivatedRouteSnapshot | null = snapshot.root;
    let active: ActivePage | undefined;
    while (route) {
      const pageTitle = route.data['pageTitle'] as PageTitle | undefined;
      if (pageTitle) {
        active = { pageTitle, params: route.params };
      }
      route = route.firstChild;
    }
    this.activePage.set(active);
  }
}
