import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ARAgingSummaryApplication } from './ARAgingSummaryApplication';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';
import { ARAgingSummaryResponseExample } from './ARAgingSummary.swagger';
import {
  ARAgingSummaryResponseDto,
  ARAgingSummaryTableResponseDto,
} from './ARAgingSummaryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/receivable-aging-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(ARAgingSummaryResponseDto, ARAgingSummaryTableResponseDto)
export class ARAgingSummaryController {
  constructor(private readonly ARAgingSummaryApp: ARAgingSummaryApplication) {}

  @Get()
  @RequirePermission(ReportsAction.READ_AR_AGING_SUMMARY, AbilitySubject.Report)
  @ApiOperation({ summary: 'Get receivable aging summary' })
  @ApiResponse({
    status: 200,
    description: 'Receivable aging summary response',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(ARAgingSummaryResponseDto) },
        example: ARAgingSummaryResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(ARAgingSummaryTableResponseDto) },
      },
    },
  })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  public async get(
    @Query() filter: ARAgingSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the xlsx format.
    if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.ARAgingSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the table format.
    } else if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.ARAgingSummaryApp.table(filter);

      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.ARAgingSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.ARAgingSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.ARAgingSummaryApp.sheet(filter);
    }
  }
}
