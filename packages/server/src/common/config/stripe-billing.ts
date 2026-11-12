import { registerAs } from '@nestjs/config';

/**
 * Whether the required Stripe Billing credentials are defined.
 *
 * A deployment is considered Bigcapital Cloud once billing is configured;
 * self-hosted installations leave these variables unset.
 */
export const isStripeBillingConfigured = (): boolean =>
  Boolean(
    process.env.STRIPE_BILLING_SECRET_KEY?.trim() &&
      process.env.STRIPE_BILLING_WEBHOOK_SECRET?.trim(),
  );

export default registerAs('stripeBilling', () => ({
  secretKey: process.env.STRIPE_BILLING_SECRET_KEY,
  webhookSecret: process.env.STRIPE_BILLING_WEBHOOK_SECRET,
  portalConfigurationId:
    process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID || '',
  successUrl: process.env.STRIPE_BILLING_SUCCESS_URL,
  cancelUrl: process.env.STRIPE_BILLING_CANCEL_URL,
}));
