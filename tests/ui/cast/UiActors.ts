import type { Browser } from 'playwright';
import { Actor, Cast } from '@serenity-js/core';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';

export const E2E_BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:8081';

/** Cast UI — Playwright + Screenplay trên Expo Web (testID → data-testid). */
export class UiActors implements Cast {
  constructor(private readonly browser: Browser) {}

  prepare(actor: Actor) {
    return actor.whoCan(
      BrowseTheWebWithPlaywright.using(
        this.browser,
        { baseURL: E2E_BASE_URL },
        {
          defaultNavigationTimeout: 30_000,
          defaultTimeout: 15_000,
        },
      ),
    );
  }
}
