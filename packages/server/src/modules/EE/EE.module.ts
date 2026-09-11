import { Module } from '@nestjs/common';
import { AuditLogsModule } from './AuditLogs/AuditLogs.module';
import { BillLandedCostsModule } from './BillLandedCosts/BillLandedCosts.module';

@Module({
  imports: [AuditLogsModule, BillLandedCostsModule],
  exports: [AuditLogsModule, BillLandedCostsModule],
})
export class EEModule {}
