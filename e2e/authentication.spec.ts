import { test, expect, Page } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { clearLocalStorage, defaultPageConfig } from './_utils';

let authPage: Page;

test.describe('authentication', () => {
  test.beforeAll(async ({ browser }) => {
    authPage = await browser.newPage({ ...defaultPageConfig() });
  });
  test.afterAll(async () => {
    await authPage.close();
  });
  test.afterEach(async ({ context }) => {
    context.clearCookies();
    await clearLocalStorage(authPage);
  });

  test.describe('login', () => {
    test.beforeEach(async () => {
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
    test('should the email or password is not correct.', async () => {
      await authPage.getByLabel('Email Address').click();
      await authPage.getByLabel('Email Address').fill(faker.internet.email());

      await authPage.getByLabel('Password').click();
      await authPage.getByLabel('Password').fill(faker.internet.password());

      await authPage.getByRole('button', { name: 'Log in' }).click();

      await expect(authPage.locator('body')).toContainText(
        'The email and password you entered did not match our records.'
      );
    });
  });

  test.describe('register', () => {
    test.beforeEach(async () => {
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
    test('should signup successfully.', async () => {
      const form = authPage.locator('form');
      await form.getByLabel('First Name').click();
      await form.getByLabel('First Name').fill(faker.person.firstName());

      await form.getByLabel('Email').click();
      await form.getByLabel('Email').fill(faker.internet.email());

      await form.getByLabel('Last Name').click();
      await form.getByLabel('Last Name').fill(faker.person.lastName());

      await form.getByLabel('Password').click();
      await form.getByLabel('Password').fill(faker.internet.password());

      await authPage.getByRole('button', { name: 'Register' }).click();

      await expect(authPage.locator('h1')).toContainText(
        'Register a New Organization now!'
      );
    });
  });

  test.describe('reset password', () => {
    test.beforeAll(async ({ browser }) => {
      authPage = await browser.newPage({ ...defaultPageConfig() });
    });
    test.afterAll(async () => {
      await authPage.close();
    });
    test.beforeEach(async () => {
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
