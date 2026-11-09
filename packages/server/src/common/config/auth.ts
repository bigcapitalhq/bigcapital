import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  resetPasswordSeconds: parseInt(
    process.env.RESET_PASSWORD_SECONDS ?? '3600',
    10,
  ),
}));
