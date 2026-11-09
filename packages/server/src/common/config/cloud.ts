import { registerAs } from '@nestjs/config';

export default registerAs('cloud', () => ({
  hostedOnCloud: process.env.HOSTED_ON_BIGCAPITAL_CLOUD === 'true',
  freePlan: {
    invoiceLimit: parseInt(process.env.FREE_PLAN_INVOICE_LIMIT ?? '5', 10),
    billLimit: parseInt(process.env.FREE_PLAN_BILL_LIMIT ?? '5', 10),
  },
}));
