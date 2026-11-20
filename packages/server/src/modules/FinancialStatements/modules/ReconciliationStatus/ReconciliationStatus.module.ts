import { Module } from '@nestjs/common';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { ReconciliationStatusController } from './ReconciliationStatus.controller';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import { ReconciliationStatusFormats } from './ReconciliationStatusFormats.service';
import { BankingReconciliationModule } from '@/modules/BankingReconciliation/BankingReconciliation.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [
    TenancyModule,
    BankingReconciliationModule,
    FinancialSheetCommonModule,
  ],
  controllers: [ReconciliationStatusController],
  providers: [ReconciliationStatusService, ReconciliationStatusFormats],
})
export class ReconciliationStatusModule {}
