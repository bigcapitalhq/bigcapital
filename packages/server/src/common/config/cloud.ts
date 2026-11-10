import { registerAs } from '@nestjs/config';

const parseTrialDays = (value?: string): number => {
  const days = parseInt(value ?? '15', 10);
  return Number.isFinite(days) && days > 0 ? days : 15;
};

export default registerAs('cloud', () => ({
  hostedOnCloud: process.env.HOSTED_ON_BIGCAPITAL_CLOUD === 'true',
  freeTrialDays: parseTrialDays(process.env.FREE_TRIAL_DAYS),
}));
