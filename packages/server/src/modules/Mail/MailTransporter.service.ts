import { Transporter } from 'nodemailer';
import { Mail } from './Mail';
import { Inject, Injectable } from '@nestjs/common';
import { MAIL_TRANSPORTER_PROVIDER } from './Mail.constants';

@Injectable()
export class MailTransporter {
  constructor(
    @Inject(MAIL_TRANSPORTER_PROVIDER)
    private readonly transporter: Transporter,
  ) {}

  send(mail: Mail) {
    return this.transporter.sendMail(mail.mailOptions);
  }
}
