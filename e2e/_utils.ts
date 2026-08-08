import { Browser, Page } from '@playwright/test';

export const clearLocalStorage = (page: Page) => {
  return page.evaluate(`window.localStorage.clear()`);
};

export const defaultPageConfig = () => {
  return {
    extraHTTPHeaders: {
      'ngrok-skip-browser-warning': 'any-value',
    },
  };
};

/**
 * Opens a fresh browser page without the shared authenticated session.
 *
 * Contexts created directly via `browser.newPage()`/`browser.newContext()`
 * inherit the project-level `use.storageState`, so `test.use({ storageState:
 * undefined })` does not apply to them. An explicitly empty storage state
 * overrides the inherited one.
 */
export const newUnauthenticatedPage = async (browser: Browser) => {
  const context = await browser.newContext({
    ...defaultPageConfig(),
    storageState: { cookies: [], origins: [] },
  });
  return context.newPage();
};
