import { TableSheetPdf } from '../../common/TableSheetPdf';
import { ITransactionsByCustomersFilter } from './TransactionsByCustomer.types';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';

export class TransactionsByCustomersPdf {
  constructor(
    private readonly transactionsByCustomersTable: TransactionsByCustomersTableInjectable,
    private readonly tableSheetPdf: TableSheetPdf,
  ) { }

  /**
   * Retrieves the transactions by customers in PDF format.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {Promise<Buffer>}
   */
  public async pdf(query: ITransactionsByCustomersFilter): Promise<Buffer> {
    const table = await this.transactionsByCustomersTable.table(query);

    return this.tableSheetPdf.convertToPdf(
      table.table,
      table.meta.organizationName,
      table.meta.sheetName,
      table.meta.formattedDateRange,
    );
  }
}
