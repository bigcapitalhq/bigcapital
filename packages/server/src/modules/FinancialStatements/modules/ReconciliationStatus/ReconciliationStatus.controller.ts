import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ReconciliationStatusService } from './ReconciliationStatus.service';
import { ReconciliationStatusQueryDto } from './ReconciliationStatusQuery.dto';
import {
  ReconciliationStatusResponseDto,
  ReconciliationStatusTableResponseDto,
} from './ReconciliationStatusResponse.dto';
import { ReconciliationStatusFormats } from './ReconciliationStatusFormats.service';
import { ReportsAction } from '../../types/Report.types';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { AcceptType } from '@/constants/accept-type';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { AbilitySubject } from '@/modules/Roles/Roles.types';

const CSV_CONTENT_TYPE = 'text/csv';
const XLSX_CONTENT_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const RESPONSE_TYPES = [
  AcceptType.ApplicationJson,
  AcceptType.ApplicationJsonTable,
  AcceptType.ApplicationCsv,
  CSV_CONTENT_TYPE,
  AcceptType.ApplicationXlsx,
  XLSX_CONTENT_TYPE,
  AcceptType.ApplicationPdf,
];

@Controller('reports/reconciliation-status')
@ApiTags('Reports')
@ApiCommonHeaders()
@ApiExtraModels(
  ReconciliationStatusResponseDto,
  ReconciliationStatusTableResponseDto,
)
@UseGuards(AuthorizationGuard, PermissionGuard)
export class ReconciliationStatusController {
  constructor(
    private readonly report: ReconciliationStatusService,
    private readonly formats: ReconciliationStatusFormats,
  ) {}

  @Get()
  @RequirePermission(
    ReportsAction.READ_RECONCILIATION_STATUS,
    AbilitySubject.Report,
  )
  @ApiOperation({ summary: 'Get the reconciliation status report' })
  @ApiProduces(...RESPONSE_TYPES)
  @ApiOkResponse({
    description: 'Reconciliation status report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(ReconciliationStatusResponseDto) },
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(ReconciliationStatusTableResponseDto) },
      },
      [CSV_CONTENT_TYPE]: { schema: { type: 'string' } },
      [XLSX_CONTENT_TYPE]: { schema: { type: 'string', format: 'binary' } },
      [AcceptType.ApplicationPdf]: {
        schema: { type: 'string', format: 'binary' },
      },
    },
  })
  public async getReconciliationStatus(
    @Query() query: ReconciliationStatusQueryDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.vary('Accept');

    switch (req.accepts(RESPONSE_TYPES)) {
      case AcceptType.ApplicationJsonTable: {
        const data = await this.formats.table(query);
        res.type(AcceptType.ApplicationJsonTable);
        return data;
      }
      case AcceptType.ApplicationCsv:
      case CSV_CONTENT_TYPE: {
        const csv = await this.formats.csv(query);
        res.attachment('reconciliation-status.csv').send(csv);
        return;
      }
      case AcceptType.ApplicationXlsx:
      case XLSX_CONTENT_TYPE: {
        const xlsx = await this.formats.xlsx(query);
        res.attachment('reconciliation-status.xlsx').send(xlsx);
        return;
      }
      case AcceptType.ApplicationPdf: {
        const pdf = await this.formats.pdf(query);
        res.setHeader(
          'Content-Disposition',
          'inline; filename="reconciliation-status.pdf"',
        );
        res.type(AcceptType.ApplicationPdf).send(pdf);
        return;
      }
      default:
        return this.report.getReport(query);
    }
  }
}
