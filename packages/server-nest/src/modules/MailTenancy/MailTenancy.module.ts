import { Module } from '@nestjs/common';
import { MailTenancy } from './MailTenancy.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [],
  providers: [MailTenancy, TenancyContext],
})
export class MailTenancyModule {}
