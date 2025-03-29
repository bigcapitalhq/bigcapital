import { castCommaListEnvVarToArray } from '@/utils/cast-comma-list-envvar-Array';
import { parseBoolean } from '@/utils/parse-boolean';
import { registerAs } from '@nestjs/config';

export default registerAs('signupRestrictions', () => ({
  disabled: parseBoolean<boolean>(process.env.SIGNUP_DISABLED, false),
  allowedDomains: castCommaListEnvVarToArray(
    process.env.SIGNUP_ALLOWED_DOMAINS,
  ),
  allowedEmails: castCommaListEnvVarToArray(process.env.SIGNUP_ALLOWED_EMAILS),
}));
