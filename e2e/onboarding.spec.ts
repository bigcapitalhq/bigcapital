import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

let authPage: Page;

test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    authPage = await browser.newPage();
    await authPage.goto('/auth/register');

    const form = authPage.locator('form');
    await form
      .locator('input[name="first_name"]')
      .fill(faker.person.firstName());
    await form.locator('input[name="last_name"]').fill(faker.person.lastName());
    await form.locator('input[name="email"]').fill(faker.internet.email());
    await form
      .locator('input[name="password"]')
      .fill(faker.internet.password());

    await authPage.getByRole('button', { name: 'Register' }).click();
  });

  test.only('should validation catch all required fields', async () => {
    const form = authPage.locator('form');

    await authPage.getByRole('button', { name: 'Save & Continue' }).click();

    await expect(form).toContainText('Organization name is a required field');
    await expect(form).toContainText('Location is a required field');
    await expect(form).toContainText('Base currency is a required field');
    await expect(form).toContainText('Fiscal year is a required field');
    await expect(form).toContainText('Time zone is a required field');
  });
  test('should sign-out when click on Signout link', () => {});

  test('should onboarding process success', () => {
    // await page.getByRole('textbox').click();
    // await page.getByRole('textbox').fill('sdafasdf');
    // await page.getByRole('button', { name: 'Select Business Location...' }).click();
    // await page.locator('a').filter({ hasText: 'Armenia' }).click();
    // await page.getByRole('button', { name: 'Select Base Currency...' }).click();
    // await page.locator('a').filter({ hasText: 'USD - US Dollar' }).click();
    // await page.getByRole('button', { name: 'Select Fiscal Year...' }).click();
    // await page.locator('a').filter({ hasText: 'May - April' }).click();
    // await page.getByRole('button', { name: 'Select Time Zone...' }).click();
    // await page.getByText('Pacific/Midway (SST)-11:00').click();
    // await page.getByRole('button', { name: 'Save & Continue' }).click();
    // await page.getByRole('heading', { name: 'Congrats! You are ready to go' }).click();
    // await page.getByRole('button', { name: 'Go to dashboard' }).click();
  });

  
  test('should go to the dashboard after clicking on "Go to dashboard" button.', () => {});
});
