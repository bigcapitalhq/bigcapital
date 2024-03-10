import { Inject, Service } from 'typedi';
import { ITransactionsByVendorsFilter } from '@/interfaces';
import { TableSheetPdf } from '../TableSheetPdf';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { HtmlTableCustomCss } from './constants';

@Service()
export class TransactionsByVendorsPdf {
  @Inject()
  private transactionsByVendorTable: TransactionsByVendorTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Converts the given balance sheet table to pdf.
   * @param {number} tenantId - Tenant ID.
   * @param {IBalanceSheetQuery} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    const table = await this.transactionsByVendorTable.table(tenantId, query);

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange,
      HtmlTableCustomCss
    );
  }
}
