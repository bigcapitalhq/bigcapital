import { Response } from 'express';
import { castArray } from 'lodash';
import { Headers, Injectable, Query, Res } from '@nestjs/common';
import { BalanceSheetInjectable } from './BalanceSheetInjectable';
import { IBalanceSheetQuery } from './BalanceSheet.types';
import { AcceptType } from '@/constants/accept-type';
import { BalanceSheetApplication } from './BalanceSheetApplication';

@Injectable()
export class BalanceSheetStatementController {
  constructor(private readonly balanceSheetApp: BalanceSheetApplication) {}

  /**
   * Retrieve the balance sheet.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async balanceSheet(
    @Query() query: IBalanceSheetQuery,
    @Res() res: Response,
    @Headers('accept') acceptHeader: string,
  ) {
    const filter = {
      ...query,
      accountsIds: castArray(query.accountsIds),
    };
    // Retrieves the json table format.
    if (acceptHeader.includes(AcceptType.ApplicationJsonTable)) {
      const table = await this.balanceSheetApp.table(tenantId, filter);

      return res.status(200).send(table);
      // Retrieves the csv format.
    } else if (acceptHeader.includes(AcceptType.ApplicationCsv)) {
      const buffer = await this.balanceSheetApp.csv(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
      res.setHeader('Content-Type', 'text/csv');

      return res.send(buffer);
      // Retrieves the xlsx format.
    } else if (acceptHeader.includes(AcceptType.ApplicationXlsx)) {
      const buffer = await this.balanceSheetApp.xlsx(tenantId, filter);

      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      return res.send(buffer);
      // Retrieves the pdf format.
    } else if (acceptHeader.includes(AcceptType.ApplicationPdf)) {
      const pdfContent = await this.balanceSheetApp.pdf(tenantId, filter);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdfContent.length,
      });
      res.send(pdfContent);
    } else {
      const sheet = await this.balanceSheetApp.sheet(tenantId, filter);

      return res.status(200).send(sheet);
    }
  }
}
