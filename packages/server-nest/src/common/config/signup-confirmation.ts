import { parseBoolean } from '@/utils/parse-boolean';
import { registerAs } from '@nestjs/config';

export default registerAs('signupConfirmation', () => ({
  enabled: parseBoolean<boolean>(process.env.SIGNUP_EMAIL_CONFIRMATION, false),
}));
