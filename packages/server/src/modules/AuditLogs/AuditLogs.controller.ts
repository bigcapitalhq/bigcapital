import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { GetAuditLogsQueryDto } from './dtos/GetAuditLogsQuery.dto';
import { GetAuditLogsService } from './queries/GetAuditLogs.service';
import { AuditLogAction } from './types/AuditLogs.types';

@Controller('audit-logs')
@ApiTags('Audit logs')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class AuditLogsController {
  constructor(private readonly getAuditLogsService: GetAuditLogsService) {}

  @Get()
  @RequirePermission(AuditLogAction.View, AbilitySubject.AuditLog)
  @ApiOperation({ summary: 'List financial audit log entries for the tenant.' })
  getAuditLogs(@Query() query: GetAuditLogsQueryDto) {
    return this.getAuditLogsService.getAuditLogs(query);
  }
}
