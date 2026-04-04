import { Response } from 'express';
import {
  Controller,
  Get,
  Headers,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { CashflowSheetApplication } from './CashflowSheetApplication';
import {
  ApiExtraModels,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CashFlowStatementQueryDto } from './CashFlowStatementQuery.dto';
import { CashflowStatementResponseExample } from './CashflowStatement.swagger';
import {
  CashflowStatementResponseDto,
  CashflowStatementTableResponseDto,
} from './CashflowStatementResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ReportsAction } from '../../types/Report.types';

@Controller('reports/cashflow-statement')
@ApiTags('Reports')
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
@ApiExtraModels(CashflowStatementResponseDto, CashflowStatementTableResponseDto)
export class CashflowController {
  constructor(private readonly cashflowSheetApp: CashflowSheetApplication) {}

  @Get()
  @RequirePermission(ReportsAction.READ_CASHFLOW, AbilitySubject.Report)
  @ApiResponse({
    status: 200,
    description: 'Cashflow statement report',
    content: {
      [AcceptType.ApplicationJson]: {
        schema: { $ref: getSchemaPath(CashflowStatementResponseDto) },
        example: CashflowStatementResponseExample,
      },
      [AcceptType.ApplicationJsonTable]: {
        schema: { $ref: getSchemaPath(CashflowStatementTableResponseDto) },
      },
    },
  })
  @ApiOperation({ summary: 'Get cashflow statement report' })
  @ApiProduces(
    AcceptType.ApplicationJson,
    AcceptType.ApplicationJsonTable,
    AcceptType.ApplicationPdf,
    AcceptType.ApplicationXlsx,
    AcceptType.ApplicationCsv,
  )
  async getCashflow(
    @Query() query: CashFlowStatementQueryDto,
    @Res({ passthrough: true }) res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const accept = acceptHeader || '';
    // Retrieves the json table format.
    if (accept.includes(AcceptType.ApplicationJsonTable)) {
      return this.cashflowSheetApp.table(query);
      // Retrieves the csv format.
    } else if (accept.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.cashflowSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      res.status(200).send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.cashflowSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.send(buffer);
      // Retrieves the pdf format.
    } else if (accept.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.cashflowSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
      // Retrieves the json format.
    } else {
      return this.cashflowSheetApp.sheet(query);
    }
  }
}
