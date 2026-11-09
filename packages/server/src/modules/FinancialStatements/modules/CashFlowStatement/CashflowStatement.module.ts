import { Module } from '@nestjs/common';
import { CashflowSheetMeta } from './CashflowSheetMeta';
import { CashFlowRepository } from './CashFlowRepository';
import { CashflowTablePdfInjectable } from './CashflowTablePdfInjectable';
import { CashflowExportInjectable } from './CashflowExportInjectable';
import { CashflowController } from './Cashflow.controller';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { CashFlowStatementService } from './CashFlowService';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { CashflowSheetApplication } from './CashflowSheetApplication';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule],
  providers: [
    CashFlowRepository,
    CashflowSheetMeta,
    CashFlowStatementService,
    CashflowTablePdfInjectable,
    CashflowExportInjectable,
    CashflowTableInjectable,
    CashflowSheetApplication,
  ],
  controllers: [CashflowController],
})
export class CashflowStatementModule {}
