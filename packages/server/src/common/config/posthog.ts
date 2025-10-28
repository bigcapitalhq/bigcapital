import { registerAs } from '@nestjs/config';

export default registerAs('posthog', () => ({
  apiKey: process.env.POSTHOG_API_KEY,
  host: process.env.POSTHOG_HOST || 'https://us.i.posthog.com',
}));
