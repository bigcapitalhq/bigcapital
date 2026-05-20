import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { GetAuditLogsQueryDto } from './dtos/GetAuditLogsQuery.dto';
import { GetAuditLogsResponseDto } from './dtos/GetAuditLogsResponse.dto';
import { GetAuditLogFilterOptionsResponseDto } from './dtos/GetAuditLogFilterOptionsResponse.dto';
import { GetAuditLogsService } from './queries/GetAuditLogs.service';
import { GetAuditLogFilterOptionsService } from './queries/GetAuditLogFilterOptions.service';
import { AuditLogAction } from './types/AuditLogs.types';

@Controller('audit-logs')
@ApiTags('Audit logs')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class AuditLogsController {
  constructor(
    private readonly getAuditLogsService: GetAuditLogsService,
    private readonly getAuditLogFilterOptionsService: GetAuditLogFilterOptionsService,
  ) {}

  @Get('filter-options')
  @RequirePermission(AuditLogAction.View, AbilitySubject.AuditLog)
  @ApiOperation({
    summary: 'Distinct subject and action values for audit log filters.',
  })
  @ApiOkResponse({ type: GetAuditLogFilterOptionsResponseDto })
  getAuditLogFilterOptions() {
    return this.getAuditLogFilterOptionsService.getFilterOptions();
  }

  @Get()
  @RequirePermission(AuditLogAction.View, AbilitySubject.AuditLog)
  @ApiOperation({ summary: 'List financial audit log entries for the tenant.' })
  @ApiOkResponse({ type: GetAuditLogsResponseDto })
  getAuditLogs(@Query() query: GetAuditLogsQueryDto) {
    return this.getAuditLogsService.getAuditLogs(query);
  }
}
