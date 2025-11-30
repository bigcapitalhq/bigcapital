import { registerAs } from '@nestjs/config';

export default registerAs('cloud', () => ({
  hostedOnCloud: process.env.HOSTED_ON_BIGCAPITAL_CLOUD === 'true',
}));
