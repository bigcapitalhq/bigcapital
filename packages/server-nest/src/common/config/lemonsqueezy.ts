import { registerAs } from '@nestjs/config';

export default registerAs('lemonsqueezy', () => ({
  apiKey: process.env.LEMONSQUEEZY_API_KEY,
  storeId: process.env.LEMONSQUEEZY_STORE_ID,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
}));
