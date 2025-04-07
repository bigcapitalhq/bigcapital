import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  host: process.env.MAIL_HOST,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
  port: parseInt(process.env.MAIL_PORT, 10),
  secure: process.env.MAIL_SECURE === 'true',
  from: {
    name: process.env.MAIL_FROM_NAME,
    address: process.env.MAIL_FROM_ADDRESS,
  },
}));
