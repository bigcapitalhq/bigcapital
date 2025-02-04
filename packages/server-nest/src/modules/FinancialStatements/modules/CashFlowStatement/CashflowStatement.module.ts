import { Module } from '@nestjs/common';
import { CashflowSheetMeta } from './CashflowSheetMeta';
import { CashFlowRepository } from './CashFlowRepository';
import { CashflowTablePdfInjectable } from './CashflowTablePdfInjectable';
import { CashflowExportInjectable } from './CashflowExportInjectable';
import { CashflowController } from './Cashflow.controller';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { CashflowTableInjectable } from './CashflowTableInjectable';
import { CashFlowStatementService } from './CashFlowService';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { CashflowSheetApplication } from './CashflowSheetApplication';

@Module({
  imports: [FinancialSheetCommonModule],
  providers: [
    CashFlowRepository,
    CashflowSheetMeta,
    CashFlowStatementService,
    CashflowTablePdfInjectable,
    CashflowExportInjectable,
    CashflowTableInjectable,
    CashflowSheetApplication,
    TenancyContext,
  ],
  controllers: [CashflowController],
})
export class CashflowStatementModule {}
