import { Module } from '@nestjs/common';
import { MailTenancy } from './MailTenancy.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule],
  providers: [MailTenancy],
  exports: [MailTenancy],
})
export class MailTenancyModule {}
