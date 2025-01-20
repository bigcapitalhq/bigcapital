import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { Get, Headers } from '@nestjs/common';
import { Query, Res } from '@nestjs/common';
import { ARAgingSummaryApplication } from './ARAgingSummaryApplication';
import { AcceptType } from '@/constants/accept-type';
import { Response } from 'express';

export class ARAgingSummaryController {
  constructor(private readonly ARAgingSummaryApp: ARAgingSummaryApplication) {}

  @Get()
  public async get(
    @Query() filter: IARAgingSummaryQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the xlsx format.
    if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.ARAgingSummaryApp.xlsx(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.ARAgingSummaryApp.table(filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.ARAgingSummaryApp.csv(filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.ARAgingSummaryApp.pdf(filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
      // Retrieves the json format.
    } else {
      const sheet = await this.ARAgingSummaryApp.sheet(filter);

      return res.status(200).send(sheet);
    }
  }
}
