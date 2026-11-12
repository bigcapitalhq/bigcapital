import { isStripeBillingConfigured } from './stripe-billing';

const ENV_KEYS = [
  'STRIPE_BILLING_SECRET_KEY',
  'STRIPE_BILLING_WEBHOOK_SECRET',
  'STRIPE_PAYMENT_SECRET_KEY',
];

describe('isStripeBillingConfigured', () => {
  const originalEnv = ENV_KEYS.reduce<Record<string, string | undefined>>(
    (values, key) => {
      values[key] = process.env[key];
      return values;
    },
    {},
  );

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      delete process.env[key];
    }
  });

  afterAll(() => {
    for (const key of ENV_KEYS) {
      const value = originalEnv[key];
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('is enabled when both billing credentials are set', () => {
    process.env.STRIPE_BILLING_SECRET_KEY = 'sk_test_123';
    process.env.STRIPE_BILLING_WEBHOOK_SECRET = 'whsec_123';

    expect(isStripeBillingConfigured()).toBe(true);
  });

  it('is disabled when the billing secret is missing', () => {
    process.env.STRIPE_BILLING_WEBHOOK_SECRET = 'whsec_123';

    expect(isStripeBillingConfigured()).toBe(false);
  });

  it('is disabled when the webhook secret is missing', () => {
    process.env.STRIPE_BILLING_SECRET_KEY = 'sk_test_123';

    expect(isStripeBillingConfigured()).toBe(false);
  });

  it('is disabled when the billing credentials are blank', () => {
    process.env.STRIPE_BILLING_SECRET_KEY = '   ';
    process.env.STRIPE_BILLING_WEBHOOK_SECRET = '   ';

    expect(isStripeBillingConfigured()).toBe(false);
  });

  it('ignores the Stripe payment secret', () => {
    process.env.STRIPE_PAYMENT_SECRET_KEY = 'sk_test_payment';

    expect(isStripeBillingConfigured()).toBe(false);
  });
});
