import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '@/modules/FinancialStatements/types/Report.types';
import { BatchDetailsReportService } from './BatchDetailsReport.service';
import { BatchDetailsReportQueryDto } from './dtos/BatchDetailsReportQuery.dto';

@Controller('reports/batch-details')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BatchDetailsReportController {
  constructor(
    private readonly batchDetailsReportService: BatchDetailsReportService,
  ) {}

  @Get('/')
  @RequirePermission(ReportsAction.READ_BATCH_DETAILS, AbilitySubject.Report)
  @ApiOperation({ summary: 'Retrieves the batch details report' })
  public report(@Query() query: BatchDetailsReportQueryDto) {
    return this.batchDetailsReportService.report(query);
  }
}
