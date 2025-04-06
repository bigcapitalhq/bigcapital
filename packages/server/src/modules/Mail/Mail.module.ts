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
        // Create reusable transporter object using the default SMTP transport
        const transporter = createTransport({
          host: configService.get('mail.host'),
          port: configService.get('mail.port'),
          secure: configService.get('mail.secure'), // true for 465, false for other ports
          auth: {
            user: configService.get('mail.username'),
            pass: configService.get('mail.password'),
          },
        });
        return transporter;
      },
    },
    MailTransporter,
  ],
  exports: [MAIL_TRANSPORTER_PROVIDER, MailTransporter],
})
export class MailModule {}
