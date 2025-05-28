import { registerAs } from '@nestjs/config';

export default registerAs('bankfeed', () => ({
  enabled:
    process.env.BANK_FEED_ENABLED === 'true' ||
    process.env.BANK_FEED_ENABLED === 'yes',
}));
