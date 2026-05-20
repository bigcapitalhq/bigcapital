import { Module } from '@nestjs/common';
import { AuditLogsModule } from './AuditLogs/AuditLogs.module';

@Module({
  imports: [AuditLogsModule],
  exports: [AuditLogsModule],
})
export class EEModule {}
