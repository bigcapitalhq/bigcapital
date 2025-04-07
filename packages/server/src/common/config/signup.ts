import { registerAs } from '@nestjs/config';

export default registerAs('signup', () => ({
  disabled: process.env.SIGNUP_DISABLED === 'true',
  allowedDomains: process.env.SIGNUP_ALLOWED_DOMAINS
    ? process.env.SIGNUP_ALLOWED_DOMAINS.split(',')
    : [],
  allowedEmails: process.env.SIGNUP_ALLOWED_EMAILS
    ? process.env.SIGNUP_ALLOWED_EMAILS.split(',')
    : [],
  emailConfirmation: process.env.SIGNUP_EMAIL_CONFIRMATION === 'true',
}));
