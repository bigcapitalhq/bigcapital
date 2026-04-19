import { registerAs } from '@nestjs/config';

export default registerAs('license', () => ({
  key: process.env.LICENSE_KEY,
  apiUrl: process.env.LICENSE_API_URL || 'https://api.bigcapital.com/license/validate',
  cacheTtl: parseInt(process.env.LICENSE_CACHE_TTL || '3600', 10),
  gracePeriodDays: parseInt(process.env.LICENSE_GRACE_PERIOD_DAYS || '7', 10),
}));
