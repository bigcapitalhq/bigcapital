import { TableSheet } from '../../common/TableSheet';
import { ITransactionsByCustomersFilter } from './TransactionsByCustomer.types';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsByCustomersExportInjectable {
  constructor(
    private readonly transactionsByCustomerTable: TransactionsByCustomersTableInjectable,
  ) {}

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: ITransactionsByCustomersFilter): Promise<Buffer> {
    const table = await this.transactionsByCustomerTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<string>}
   */
  public async csv(query: ITransactionsByCustomersFilter): Promise<string> {
    const table = await this.transactionsByCustomerTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
