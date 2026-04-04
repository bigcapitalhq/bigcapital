import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GeneralLedgerApplication } from './GeneralLedgerApplication';
import { AcceptType } from '@/constants/accept-type';
import { GeneralLedgerQueryDto } from './GeneralLedgerQuery.dto';
import { GeneralLedgerResponseExample } from './GeneralLedger.swagger';
import {
  GeneralLedgerResponseDto,
  GeneralLedgerTableResponseDto,
} from './GeneralLedgerResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('/reports/general-ledger')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(GeneralLedgerResponseDto, GeneralLedgerTableResponseDto)
export class GeneralLedgerController {
  constructor(
    private readonly generalLedgerApplication: GeneralLedgerApplication,
  ) {}

  @Get()
  @RequirePermission(ReportsAction.READ_GENERAL_LEDGET, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'General ledger report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(GeneralLedgerResponseDto) },
        example: GeneralLedgerResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(GeneralLedgerTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Get general ledger report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  public async getGeneralLedger(
    @Query() query: GeneralLedgerQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.generalLedgerApplication.table(query);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.generalLedgerApplication.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.send(buffer);
      // Retrieves the xlsx format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.generalLedgerApplication.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.generalLedgerApplication.pdf(query);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.generalLedgerApplication.sheet(query);
    }
  }
}
