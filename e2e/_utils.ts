import { Page } from '@playwright/test';

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
