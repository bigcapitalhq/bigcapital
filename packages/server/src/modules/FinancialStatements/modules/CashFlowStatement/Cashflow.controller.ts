import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { AcceptType } from '@/constants/accept-type';
import { CashflowSheetApplication } from './CashflowSheetApplication';
import {
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CashFlowStatementQueryDto } from './CashFlowStatementQuery.dto';
import { CashflowStatementResponseExample } from './CashflowStatement.swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';

@Controller('reports/cashflow-statement')
@ApiTags('Reports')
@ApiCommonHeaders()
export class CashflowController {
  constructor(private readonly cashflowSheetApp: CashflowSheetApplication) { }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Cashflow statement report',
    example: CashflowStatementResponseExample,
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
