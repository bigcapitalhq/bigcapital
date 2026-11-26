import { Module } from '@nestjs/common';
import { AuditLogsModule } from './AuditLogs/AuditLogs.module';
import { BatchesModule } from './Batches/Batches.module';
import { BillLandedCostsModule } from './BillLandedCosts/BillLandedCosts.module';
import { RecurringJournalsModule } from './RecurringJournals/RecurringJournals.module';
import { SamlModule } from './Saml/Saml.module';

@Module({
  imports: [
    AuditLogsModule,
    BatchesModule,
    BillLandedCostsModule,
    RecurringJournalsModule,
    SamlModule,
  ],
  exports: [
    AuditLogsModule,
    BatchesModule,
    BillLandedCostsModule,
    RecurringJournalsModule,
    SamlModule,
  ],
})
export class EEModule {}
