import { registerAs } from '@nestjs/config';

export default registerAs('plaid', () => ({
  env: process.env.PLAID_ENV || 'sandbox',
  clientId: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  linkWebhook: process.env.PLAID_LINK_WEBHOOK,
}));
