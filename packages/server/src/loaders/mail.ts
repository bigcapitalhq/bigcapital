import nodemailer from 'nodemailer';
import config from '@/config';

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: config.mail.host,
  port: config.mail.port,
  secure: config.mail.secure, // true for 465, false for other ports
  auth: {
    user: config.mail.username,
    pass: config.mail.password,
  },
});

export default transporter;