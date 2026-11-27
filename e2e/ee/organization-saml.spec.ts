import { expect, test } from '@playwright/test';

test.use({ storageState: undefined });

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/meta', (route) => route.fulfill({ json: {} }));
});

test('SSO starts with the organization selected on the sign-in page', async ({
  page,
}) => {
  await page.route('**/api/auth/saml/acme/login', (route) =>
    route.fulfill({
      status: 302,
      headers: { location: '/auth/saml/callback?error=saml' },
    }),
  );

  await page.goto('/auth/login');
  await page.getByRole('link', { name: 'Sign in with SSO' }).click();
  await page.getByLabel('Organization ID').fill('acme');
  await page
    .getByRole('button', { name: 'Continue to identity provider' })
    .click();
  await expect(page.getByRole('alert')).toContainText('SSO sign-in failed');
  await expect(page.getByRole('link', { name: 'Try again' })).toHaveAttribute(
    'href',
    '/auth/saml/login',
  );
});

test('SSO redeems the handoff once and waits for required MFA before signing in', async ({
  page,
  context,
}) => {
  let exchangeCount = 0;
  await page.route('**/api/auth/saml/exchange', (route) => {
    exchangeCount += 1;
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toEqual({ code: 'one-time-code' });
    return route.fulfill({
      json: {
        mfa: {
          challenge_token: 'challenge',
          purpose: 'verify',
          methods: [{ id: 'totp', kind: 'otp' }],
        },
      },
    });
  });

  await page.goto('/auth/saml/callback#code=one-time-code');
  await expect(page.getByTestId('two-factor-submit')).toBeVisible();
  expect(exchangeCount).toBe(1);
  expect(new URL(page.url()).hash).toBe('');
  expect(
    (await context.cookies()).find(({ name }) => name === 'token'),
  ).toBeUndefined();

  await page.route('**/api/auth/signin/mfa/verify', (route) => {
    expect(route.request().postDataJSON()).toEqual({
      challenge_token: 'challenge',
      method: 'totp',
      code: '123456',
    });
    return route.fulfill({
      json: {
        access_token: 'completed-session',
        user_id: 5,
        organization_id: 'acme',
        tenant_id: 2,
      },
    });
  });
  await page.getByTestId('two-factor-code-input').fill('123456');
  await page.getByTestId('two-factor-submit').click();
  await expect
    .poll(async () =>
      Object.fromEntries(
        (await context.cookies()).map(({ name, value }) => [name, value]),
      ),
    )
    .toMatchObject({
      token: 'completed-session',
      organization_id: 'acme',
      authenticated_user_id: '5',
      tenant_id: '2',
    });
});
