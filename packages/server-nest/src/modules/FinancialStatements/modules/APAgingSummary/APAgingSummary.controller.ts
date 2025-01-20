import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { APAgingSummaryApplication } from './APAgingSummaryApplication';
import { IAPAgingSummaryQuery } from './APAgingSummary.types';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';

@Controller('reports/payable-aging-summary')
export class APAgingSummaryController {
  constructor(private readonly APAgingSummaryApp: APAgingSummaryApplication) {}

  @Get()
  public async get(
    @Query() filter: IAPAgingSummaryQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.APAgingSummaryApp.table(filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const csv = await this.APAgingSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(csv);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.APAgingSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.APAgingSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const sheet = await this.APAgingSummaryApp.sheet(filter);

      return res.status(200).send(sheet);
    }
  }
}
