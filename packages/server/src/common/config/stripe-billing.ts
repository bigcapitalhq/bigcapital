import { registerAs } from '@nestjs/config';

export default registerAs('stripeBilling', () => ({
  // Falls back to the Stripe Connect payment secret so Cloud deployments can
  // use the same Stripe account for both billing and payments.
  secretKey:
    process.env.STRIPE_BILLING_SECRET_KEY ||
    process.env.STRIPE_PAYMENT_SECRET_KEY,
  webhookSecret: process.env.STRIPE_BILLING_WEBHOOK_SECRET,
  portalConfigurationId:
    process.env.STRIPE_BILLING_PORTAL_CONFIGURATION_ID || '',
  successUrl: process.env.STRIPE_BILLING_SUCCESS_URL,
  cancelUrl: process.env.STRIPE_BILLING_CANCEL_URL,
}));
