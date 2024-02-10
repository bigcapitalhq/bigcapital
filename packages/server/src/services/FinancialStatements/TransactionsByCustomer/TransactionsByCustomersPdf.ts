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
   * @param {IBalanceSheetQuery} query - Balance sheet query.
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
    const sheetName = 'Transactions By Customers';

    return this.tableSheetPdf.convertToPdf(
      tenantId,
      table.table,
      sheetName,
      table.meta.baseCurrency
    );
  }
}
