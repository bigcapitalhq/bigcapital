import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { ICashFlowStatementQuery } from './Cashflow.types';
import { AcceptType } from '@/constants/accept-type';
import { CashflowSheetApplication } from './CashflowSheetApplication';

@Controller('reports/cashflow')
export class CashflowController {
  constructor(private readonly cashflowSheetApp: CashflowSheetApplication) {}

  @Get()
  async getCashflow(
    @Query() query: ICashFlowStatementQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const filter = {
      ...query,
    };
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.cashflowSheetApp.table(filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.cashflowSheetApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.status(200).send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.cashflowSheetApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.cashflowSheetApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const cashflow = await this.cashflowSheetApp.sheet(filter);

      return res.status(200).send(cashflow);
    }
  }
}
