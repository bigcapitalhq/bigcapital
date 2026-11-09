import { Module } from '@nestjs/common';
import { TrialBalanceExportInjectable } from './TrialBalanceExportInjectable';
import { TrialBalanceSheetController } from './TrialBalanceSheet.controller';
import { TrialBalanceSheetApplication } from './TrialBalanceSheetApplication';
import { TrialBalanceSheetService } from './TrialBalanceSheetInjectable';
import { TrialBalanceSheetTableInjectable } from './TrialBalanceSheetTableInjectable';
import { TrialBalanceSheetMeta } from './TrialBalanceSheetMeta';
import { TrialBalanceSheetRepository } from './TrialBalanceSheetRepository';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { TrialBalanceSheetPdfInjectable } from './TrialBalanceSheetPdfInjectsable';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  providers: [
    TrialBalanceSheetApplication,
    TrialBalanceSheetService,
    TrialBalanceSheetTableInjectable,
    TrialBalanceExportInjectable,
    TrialBalanceSheetMeta,
    TrialBalanceSheetRepository,
    TrialBalanceSheetPdfInjectable,
  ],
  controllers: [TrialBalanceSheetController],
})
export class TrialBalanceSheetModule {}
