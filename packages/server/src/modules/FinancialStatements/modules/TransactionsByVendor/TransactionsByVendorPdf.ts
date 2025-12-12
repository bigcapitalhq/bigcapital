import { Injectable } from '@nestjs/common';
import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ITransactionsByVendorsFilter } from './TransactionsByVendor.types';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { HtmlTableCustomCss } from './constants';

@Injectable()
export class TransactionsByVendorsPdf {
  constructor(
    private readonly transactionsByVendorTable: TransactionsByVendorTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Converts the given balance sheet table to pdf.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ITransactionsByVendorsFilter): Promise<Buffer> {
    const table = await this.transactionsByVendorTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss,
    );
  }
}
