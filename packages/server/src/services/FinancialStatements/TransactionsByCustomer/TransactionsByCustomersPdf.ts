import { ITransactionsByCustomersFilter } from '@/interfaces';
import { Inject } from 'typedi';
import { TableSheetPdf } from '../TableSheetPdf';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';

export class TransactionsByCustomersPdf {
  @Inject()
  private transactionsByCustomersTable: TransactionsByCustomersTableInjectable;

  @Inject()
  private tableSheetPdf: TableSheetPdf;

  /**
   * Retrieves the transactions by customers in PDF format.
   * @param {number} tenantId - Tenant ID.
   * @param {ITransactionsByCustomersFilter} query - Balance sheet query.
   * @returns {Promise<Buffer>}
   */
  public async pdf(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<Buffer> {
    const table = await this.transactionsByCustomersTable.table(
      tenantId,
      query
    );
    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      table.meta.sheetName,
      table.meta.formattedDateRange
    );
  }
}
