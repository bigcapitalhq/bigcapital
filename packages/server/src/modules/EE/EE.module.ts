import { Module } from '@nestjs/common';
import { AuditLogsModule } from './AuditLogs/AuditLogs.module';
import { BatchesModule } from './Batches/Batches.module';
import { BillLandedCostsModule } from './BillLandedCosts/BillLandedCosts.module';
import { RecurringJournalsModule } from './RecurringJournals/RecurringJournals.module';

@Module({
  imports: [
    AuditLogsModule,
    BatchesModule,
    BillLandedCostsModule,
    RecurringJournalsModule,
  ],
  exports: [
    AuditLogsModule,
    BatchesModule,
    BillLandedCostsModule,
    RecurringJournalsModule,
  ],
})
export class EEModule {}
