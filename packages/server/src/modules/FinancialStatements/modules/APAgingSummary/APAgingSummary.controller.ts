import { Response } from 'express';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { APAgingSummaryApplication } from './APAgingSummaryApplication';
import { AcceptType } from '@/constants/accept-type';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';
import { APAgingSummaryResponseExample } from './APAgingSummary.swagger';
import {
  APAgingSummaryResponseDto,
  APAgingSummaryTableResponseDto,
} from './APAgingSummaryResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/payable-aging-summary')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(APAgingSummaryResponseDto, APAgingSummaryTableResponseDto)
export class APAgingSummaryController {
  constructor(private readonly APAgingSummaryApp: APAgingSummaryApplication) {}

  @Get()
  @RequirePermission(ReportsAction.READ_AP_AGING_SUMMARY, AbilitySubject.Report)
  @ApiOperation({ summary: 'Get payable aging summary' })
  @ApiResponse({
    status: 200,
    description: 'A/P aging summary response',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(APAgingSummaryResponseDto) },
        example: APAgingSummaryResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(APAgingSummaryTableResponseDto) },
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
    @Query() filter: APAgingSummaryQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.APAgingSummaryApp.table(filter);

      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const csv = await this.APAgingSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(csv);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.APAgingSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.APAgingSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.APAgingSummaryApp.sheet(filter);
    }
  }
}
