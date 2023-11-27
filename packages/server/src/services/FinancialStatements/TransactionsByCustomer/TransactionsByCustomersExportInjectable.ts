import { Inject, Service } from 'typedi';
import { ITransactionsByCustomersFilter } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';

@Service()
export class TransactionsByCustomersExportInjectable {
  @Inject()
  private transactionsByCustomerTable: TransactionsByCustomersTableInjectable;

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<Buffer> {
    const table = await this.transactionsByCustomerTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<string>}
   */
  public async csv(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<string> {
    const table = await this.transactionsByCustomerTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
