import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.APP_JWT_SECRET || '123123',
}));
