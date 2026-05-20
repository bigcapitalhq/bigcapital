import { registerAs } from '@nestjs/config';

export default registerAs('throttle', () => ({
  global: {
    ttl: parseInt(process.env.THROTTLE_GLOBAL_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_GLOBAL_LIMIT ?? '300', 10),
  },
  auth: {
    ttl: parseInt(process.env.THROTTLE_AUTH_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_AUTH_LIMIT ?? '30', 10),
  },
}));


