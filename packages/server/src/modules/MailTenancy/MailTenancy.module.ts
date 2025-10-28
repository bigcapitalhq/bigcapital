import { Module } from '@nestjs/common';
import { MailTenancy } from './MailTenancy.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  providers: [MailTenancy, TenancyContext],
  exports: [MailTenancy],
})
export class MailTenancyModule {}
