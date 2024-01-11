import { Inject, Service } from 'typedi';
import { BalanceSheetTableInjectable } from './BalanceSheetTableInjectable';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { IBalanceSheetQuery } from '@/interfaces';

@Service()
export class BalanceSheetExportInjectable {
  @Inject()
  private balanceSheetTable: BalanceSheetTableInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IBalanceSheetQuery) {
    const table = await this.balanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<string> {
    const table = await this.balanceSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
