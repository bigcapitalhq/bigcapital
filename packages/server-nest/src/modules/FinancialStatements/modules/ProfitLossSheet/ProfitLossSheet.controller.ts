import { Response } from 'express';
import { Controller, Get, Headers, Query, Res } from '@nestjs/common';
import { IProfitLossSheetQuery } from './ProfitLossSheet.types';
import { ProfitLossSheetApplication } from './ProfitLossSheetApplication';
import { AcceptType } from '@/constants/accept-type';
import { PublicRoute } from '@/modules/Auth/Jwt.guard';

@Controller('/reports/profit-loss-sheet')
@PublicRoute()
export class ProfitLossSheetController {
  constructor(
    private readonly profitLossSheetApp: ProfitLossSheetApplication,
  ) {}

  /**
   * Retrieves the profit/loss sheet.
   * @param {IProfitLossSheetQuery} query
   * @param {Response} res
   * @param {string} acceptHeader
   */
  @Get('/')
  async profitLossSheet(
    @Query() query: IProfitLossSheetQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    // Retrieves the csv format.
    if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const sheet = await this.profitLossSheetApp.csv(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(sheet);
      // Retrieves the json table format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.profitLossSheetApp.table(query);

      return res.status(200).send(table);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const sheet = await this.profitLossSheetApp.xlsx(query);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(sheet);
      // Retrieves the json format.
    } else if (acceptHeader.includes(AcceptType.ApplicationJson)) {
      const pdfContent = await this.profitLossSheetApp.pdf(query);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      return res.send(pdfContent);
    } else {
      const sheet = await this.profitLossSheetApp.sheet(query);

      return res.status(200).send(sheet);
    }
  }
}
