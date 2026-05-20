import { Module } from '@nestjs/common';
import { AuditLogsController } from './AuditLogs.controller';
import { AuditLogService } from './AuditLog.service';
import { GetAuditLogsService } from './queries/GetAuditLogs.service';
import { GetAuditLogFilterOptionsService } from './queries/GetAuditLogFilterOptions.service';
import { FinancialAuditLogSubscriber } from './subscribers/FinancialAuditLog.subscriber';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RegisterTenancyModel } from '@/modules/Tenancy/TenancyModels/Tenancy.module';
import { AuditLog } from './models/AuditLog.model';

const models = [
  RegisterTenancyModel(AuditLog)
];
@Module({
  imports: [...models],
  controllers: [AuditLogsController],
  providers: [
    AuditLogService,
    GetAuditLogsService,
    GetAuditLogFilterOptionsService,
    FinancialAuditLogSubscriber,
    AuthorizationGuard,
    PermissionGuard,
  ],
  exports: [AuditLogService, ...models],
})
export class AuditLogsModule {}
