import { Module } from '@nestjs/common';
import { BalanceSheetInjectable } from './BalanceSheetInjectable';
import { BalanceSheetApplication } from './BalanceSheetApplication';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { BalanceSheetExportInjectable } from './BalanceSheetExportInjectable';
import { BalanceSheetMetaInjectable } from './BalanceSheetMeta';
import { BalanceSheetPdfInjectable } from './BalanceSheetPdfInjectable';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { BalanceSheetStatementController } from './BalanceSheet.controller';
import { BalanceSheetRepository } from './BalanceSheetRepository';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  controllers: [BalanceSheetStatementController],
  providers: [
    BalanceSheetRepository,
    BalanceSheetInjectable,
    BalanceSheetTableInjectable,
    BalanceSheetExportInjectable,
    BalanceSheetMetaInjectable,
    BalanceSheetApplication,
    BalanceSheetPdfInjectable,
  ],
  exports: [BalanceSheetInjectable],
})
export class BalanceSheetModule {}
