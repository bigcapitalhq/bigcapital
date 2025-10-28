import { registerAs } from '@nestjs/config';

export default registerAs('openExchange', () => ({
  appId: process.env.OPEN_EXCHANGE_RATE_APP_ID,
}));
