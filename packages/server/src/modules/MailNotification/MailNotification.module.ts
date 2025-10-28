import { Module } from '@nestjs/common';
import { ContactMailNotification } from './ContactMailNotification';
import { MailTenancyModule } from '../MailTenancy/MailTenancy.module';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [MailTenancyModule],
  providers: [ContactMailNotification, TenancyContext],
  exports: [ContactMailNotification],
})
export class MailNotificationModule {}
