import { Module } from '@nestjs/common';
import { AuditLogsModule } from './AuditLogs/AuditLogs.module';
import { BillLandedCostsModule } from './BillLandedCosts/BillLandedCosts.module';
import { RecurringJournalsModule } from './RecurringJournals/RecurringJournals.module';

@Module({
  imports: [AuditLogsModule, BillLandedCostsModule, RecurringJournalsModule],
  exports: [AuditLogsModule, BillLandedCostsModule, RecurringJournalsModule],
})
export class EEModule {}
