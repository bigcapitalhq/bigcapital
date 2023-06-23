import { Page } from "@playwright/test";


export const clearLocalStorage = (page: Page) => {
  return page.evaluate(`window.localStorage.clear()`);
}