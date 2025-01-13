import { Module } from '@nestjs/common';
import { ContactMailNotification } from './ContactMailNotification';

@Module({
  imports: [ContactMailNotification],
  exports: [ContactMailNotification],
})
export class MailNotificationModule {}
