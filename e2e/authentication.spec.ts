import { test, expect, Page } from '@playwright/test';

let authPage: Page;

test.describe('authentication', () => {
  test.beforeAll(async ({ browser }) => {
    authPage = await browser.newPage();
  });

  test.describe('login', () => {
    test.beforeAll(async () => {
      await authPage.goto('/auth/login');
    });
    test('should show the login page.', async () => {
      await expect(authPage.locator('body')).toContainText(
        "Don't have an account? Sign up"
      );
    });
    test('should email and password be required.', async () => {
      await authPage.getByRole('button', { name: 'Log in' }).click();

      await expect(authPage.locator('form')).toContainText(
        'Email is a required field'
      );
      await expect(authPage.locator('form')).toContainText(
        'Password is a required field'
      );
    });
    test('should go to the register page when click on sign up link', async () => {
      await authPage.getByRole('link', { name: 'Sign up' }).click();
      await expect(authPage.url()).toContain('/auth/register');
    });
  });

  test.describe('register', () => {
    test.beforeAll(async () => {
      await authPage.goto('/auth/register');
    });
    test('should first name, last name, email and password be required.', async () => {
      await authPage.getByRole('button', { name: 'Register' }).click();

      await expect(authPage.locator('form')).toContainText(
        'First name is a required field'
      );
      await expect(authPage.locator('form')).toContainText(
        'Last name is a required field'
      );
      await expect(authPage.locator('form')).toContainText(
        'Email is a required field'
      );
      await expect(authPage.locator('form')).toContainText(
        'Password is a required field'
      );
    });
  });

  test.describe('reset password', () => {
    test.beforeAll(async () => {
      await authPage.goto('/auth/send_reset_password');
    });
    test('should email be required.', async () => {
      await authPage.getByRole('button', { name: 'Reset Password' }).click();
      await expect(authPage.locator('form')).toContainText(
        'Email is a required field'
      );
    });
  });
});
