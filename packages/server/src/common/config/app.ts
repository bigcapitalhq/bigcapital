import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  baseUrl: process.env.BASE_URL,
}));
