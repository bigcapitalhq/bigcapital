import { Module } from '@nestjs/common';
import { ProfitLossSheetService } from './ProfitLossSheetService';
import { ProfitLossSheetExportInjectable } from './ProfitLossSheetExportInjectable';
import { ProfitLossTablePdfInjectable } from './ProfitLossTablePdfInjectable';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';
import { ProfitLossSheetMeta } from './ProfitLossSheetMeta';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { ProfitLossSheetController } from './ProfitLossSheet.controller';
import { ProfitLossSheetApplication } from './ProfitLossSheetApplication';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, AccountsModule],
  controllers: [ProfitLossSheetController],
  providers: [
    ProfitLossSheetApplication,
    ProfitLossSheetService,
    ProfitLossSheetExportInjectable,
    ProfitLossTablePdfInjectable,
    ProfitLossSheetTableInjectable,
    ProfitLossSheetMeta,
    ProfitLossSheetRepository,
  ],
})
export class ProfitLossSheetModule {}
