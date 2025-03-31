import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ICashFlowStatementQuery } from './Cashflow.types';
import { AcceptType } from '@/constants/accept-type';
import { CashflowSheetApplication } from './CashflowSheetApplication';
import { PublicRoute } from '@/modules/Auth/guards/Jwt.local';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('reports/cashflow-statement')
@PublicRoute()
@ApiTags('reports')
export class CashflowController {
  constructor(private readonly cashflowSheetApp: CashflowSheetApplication) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Cashflow statement report' })
  @ApiOperation({ summary: 'Get cashflow statement report' })
  async getCashflow(
    @Query() query: ICashFlowStatementQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.cashflowSheetApp.table(query);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.cashflowSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.status(200).send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.cashflowSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.cashflowSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const cashflow = await this.cashflowSheetApp.sheet(query);

      return res.status(200).send(cashflow);
    }
  }
}
