import { Module } from '@nestjs/common';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { ReconciliationStatusController } from './ReconciliationStatus.controller';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import { ReconciliationStatusExportInjectable } from './ReconciliationStatusExportInjectable';
import { ReconciliationStatusPdfInjectable } from './ReconciliationStatusPdfInjectable';
import { ReconciliationStatusTableInjectable } from './ReconciliationStatusTableInjectable';
import { BankingReconciliationModule } from '@/modules/BankingReconciliation/BankingReconciliation.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [
    TenancyModule,
    BankingReconciliationModule,
    FinancialSheetCommonModule,
  ],
  controllers: [ReconciliationStatusController],
  providers: [
    ReconciliationStatusService,
    ReconciliationStatusTableInjectable,
    ReconciliationStatusExportInjectable,
    ReconciliationStatusPdfInjectable,
  ],
})
export class ReconciliationStatusModule {}
