import { TableSheetPdf } from '../../common/TableSheetPdf';
import { IBalanceSheetQuery } from './BalanceSheet.types';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { HtmlTableCustomCss } from './constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceSheetPdfInjectable {
  constructor(
    private readonly balanceSheetTable: BalanceSheetTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Converts the given balance sheet table to pdf.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: IBalanceSheetQuery): Promise<Buffer> {
    const table = await this.balanceSheetTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
