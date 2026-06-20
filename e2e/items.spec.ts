import { test } from '@playwright/test';

test.describe('item', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/items');
  });
  test('should validate all required fields.', async () => {});
  test('should save the item successfully.', async () => {});
  test('should item code be unqiue.', async () => {});
});
