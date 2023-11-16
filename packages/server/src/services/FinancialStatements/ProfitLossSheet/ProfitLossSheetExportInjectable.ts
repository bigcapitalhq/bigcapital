import { Inject, Service } from 'typedi';
import { IProfitLossSheetQuery } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { ProfitLossSheetTableInjectable } from './ProfitLossSheetTableInjectable';

@Service()
export class ProfitLossSheetExportInjectable {
  @Inject()
  private profitLossSheetTable: ProfitLossSheetTableInjectable;

  /**
   * Retrieves the profit/loss sheet in XLSX format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IProfitLossSheetQuery) {
    const table = await this.profitLossSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the profit/loss sheet in CSV format.
   * @param {number} tenantId
   * @param {IProfitLossSheetQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IProfitLossSheetQuery
  ): Promise<string> {
    const table = await this.profitLossSheetTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
