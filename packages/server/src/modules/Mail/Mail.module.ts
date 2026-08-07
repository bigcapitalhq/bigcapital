import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { MAIL_TRANSPORTER_PROVIDER } from './Mail.constants';
import { MailTransporter } from './MailTransporter.service';

@Module({
  providers: [
    {
      provide: MAIL_TRANSPORTER_PROVIDER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const username = configService.get('mail.username');
        const password = configService.get('mail.password');

        // Create reusable transporter object using the default SMTP transport.
        // Only pass `auth` when credentials are configured, so no-auth SMTP
        // relays (e.g. internal Postfix/SES) are not forced to authenticate.
        const transporter = createTransport({
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          secure: configService.get('mail.secure'), // true for 465, false for other ports
          ...(username ? { auth: { user: username, pass: password } } : {}),
        });
        return transporter;
      },
    },
    MailTransporter,
  ],
  exports: [MAIL_TRANSPORTER_PROVIDER, MailTransporter],
})
export class MailModule {}
