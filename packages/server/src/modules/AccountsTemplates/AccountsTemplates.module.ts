import { Module } from '@nestjs/common';
import { AccountsModule } from '../Accounts/Accounts.module';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AccountsTemplatesController } from './AccountsTemplates.controller';
import { AccountsTemplateStateService } from './AccountsTemplateState.service';
import { ApplyAccountsTemplateService } from './ApplyAccountsTemplate.service';
import { PreviewAccountsTemplateService } from './PreviewAccountsTemplate.service';

@Module({
  imports: [AccountsModule, TenancyModule, TenancyDatabaseModule],
  controllers: [AccountsTemplatesController],
  providers: [
    AccountsTemplateStateService,
    PreviewAccountsTemplateService,
    ApplyAccountsTemplateService,
  ],
  exports: [PreviewAccountsTemplateService, ApplyAccountsTemplateService],
})
export class AccountsTemplatesModule {}
