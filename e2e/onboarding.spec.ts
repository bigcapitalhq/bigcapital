import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { newUnauthenticatedPage } from './_utils';

// This spec exercises the onboarding UI itself with its own freshly
// registered user, so it must not reuse the shared onboarded session.
test.use({ storageState: undefined });

let authPage: Page;
let businessLegalName: string = faker.company.name();

test.describe('onboarding', () => {
  test.beforeAll(async ({ browser }) => {
    authPage = await newUnauthenticatedPage(browser);
    await authPage.goto('/auth/register');

    const form = authPage.locator('form');

    await form.getByLabel('First Name').fill(faker.person.firstName());
    await form.getByLabel('Email').fill(faker.internet.email());
    await form.getByLabel('Last Name').fill(faker.person.lastName());
    await form.getByLabel('Password').fill(faker.internet.password());

    await authPage.getByRole('button', { name: 'Register' }).click();
  });
  test('should validation catch all required fields', async () => {
    const form = authPage.locator('form');

    await authPage.getByRole('button', { name: 'Save & Continue' }).click();

    await expect(form).toContainText('Organization name is a required field');
    await expect(form).toContainText('Location is a required field');
    await expect(form).toContainText('Base currency is a required field');
    await expect(form).toContainText('Fiscal year is a required field');
    await expect(form).toContainText('Time zone is a required field');
  });
  test.describe('after onboarding', () => {
    test.beforeAll(async () => {
      await authPage.getByLabel('Legal Organization Name').click();
      await authPage
        .getByLabel('Legal Organization Name')
        .fill(businessLegalName);

      // Fill Business Location.
      await authPage
        .getByRole('button', { name: 'Select Business Location...' })
        .click();
      await authPage.locator('a').filter({ hasText: 'Albania' }).click();

      // Fill Base Currency.
      await authPage
        .getByRole('button', { name: 'Select Base Currency...' })
        .click();
      await authPage
        .locator('a')
        .filter({ hasText: 'AED - United Arab Emirates Dirham' })
        .click();

      // Fill Fasical Year.
      await authPage
        .getByRole('button', { name: 'Select Fiscal Year...' })
        .click();
      await authPage.locator('a').filter({ hasText: 'June - May' }).click();

      // Fill Timezone.
      // The timezone select only shows a minimal list until a query is typed,
      // and the IANA code is not part of the option text, so search by the
      // short label ("Marquesas") before selecting the option.
      await authPage.getByRole('button', { name: 'Select Time Zone...' }).click();
      await authPage
        .getByPlaceholder('Search for timezones...')
        .fill('Marquesas');
      await authPage.getByRole('menuitem', { name: /Marquesas/ }).click();

      // Click on Submit button
      await authPage.getByRole('button', { name: 'Save & Continue' }).click();
    });
    test('should onboarding process success', async () => {
      await expect(authPage.locator('body')).toContainText(
        'Congrats! You are ready to go',
        {
          timeout: 30000,
        }
      );
    });
    test('should go to the dashboard after clicking on "Go to dashboard" button.', async () => {
      await authPage.getByRole('button', { name: 'Go to dashboard' }).click();

      await expect(
        authPage.locator('[data-testId="dashboard-topbar"] h1')
      ).toContainText(businessLegalName);
    });
  });
});
