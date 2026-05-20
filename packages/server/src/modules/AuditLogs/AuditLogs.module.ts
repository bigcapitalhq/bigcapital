import { Module } from '@nestjs/common';
import { AuditLogsController } from './AuditLogs.controller';
import { AuditLogService } from './AuditLog.service';
import { GetAuditLogsService } from './queries/GetAuditLogs.service';
import { FinancialAuditLogSubscriber } from './subscribers/FinancialAuditLog.subscriber';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';

@Module({
  controllers: [AuditLogsController],
  providers: [
    AuditLogService,
    GetAuditLogsService,
    FinancialAuditLogSubscriber,
    AuthorizationGuard,
    PermissionGuard,
  ],
  exports: [AuditLogService],
})
export class AuditLogsModule {}
