import { registerAs } from '@nestjs/config';

export default registerAs('stripePayment', () => ({
  secretKey: process.env.STRIPE_PAYMENT_SECRET_KEY,
  publishableKey: process.env.STRIPE_PAYMENT_PUBLISHABLE_KEY,
  clientId: process.env.STRIPE_PAYMENT_CLIENT_ID,
  webhooksSecret: process.env.STRIPE_PAYMENT_WEBHOOKS_SECRET,
  redirectUrl: process.env.STRIPE_PAYMENT_REDIRECT_URL,
}));
