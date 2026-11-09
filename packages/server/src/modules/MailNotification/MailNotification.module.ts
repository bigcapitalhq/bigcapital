import { Module } from '@nestjs/common';
import { ContactMailNotification } from './ContactMailNotification';
import { MailTenancyModule } from '../MailTenancy/MailTenancy.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, MailTenancyModule],
  providers: [ContactMailNotification],
  exports: [ContactMailNotification],
})
export class MailNotificationModule {}
