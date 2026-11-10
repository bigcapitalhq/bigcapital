import { registerAs } from '@nestjs/config';
import { isStripeBillingConfigured } from './stripe-billing';

const parseTrialDays = (value?: string): number => {
  const days = parseInt(value ?? '15', 10);
  return Number.isFinite(days) && days > 0 ? days : 15;
};

export default registerAs('cloud', () => ({
  // Bigcapital Cloud is the deployment where Stripe Billing is configured.
  hostedOnCloud: isStripeBillingConfigured(),
  freeTrialDays: parseTrialDays(process.env.FREE_TRIAL_DAYS),
}));
