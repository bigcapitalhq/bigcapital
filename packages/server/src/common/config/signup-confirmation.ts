import { registerAs } from '@nestjs/config';
import { parseBoolean } from '@/utils/parse-boolean';

export default registerAs('signupConfirmation', () => ({
  enabled: parseBoolean<boolean>(process.env.SIGNUP_EMAIL_CONFIRMATION, false),
}));
