import { Inject, Service } from 'typedi';
import { ITransactionsByVendorsFilter } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';

@Service()
export class TransactionsByVendorExportInjectable {
  @Inject()
  private transactionsByVendorTable: TransactionsByVendorTableInjectable;

  /**
   * Retrieves the cashflow sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    const table = await this.transactionsByVendorTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the cashflow sheet in CSV format.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<string>}
   */
  public async csv(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<string> {
    const table = await this.transactionsByVendorTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
