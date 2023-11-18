import { Inject, Service } from 'typedi';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { IAPAgingSummaryQuery } from '@/interfaces';

@Service()
export class APAgingSummaryExportInjectable {
  @Inject()
  private APAgingSummaryTable: APAgingSummaryTableInjectable;

  /**
   * Retrieves the A/P aging summary sheet in XLSX format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IAPAgingSummaryQuery) {
    const table = await this.APAgingSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the A/P aging summary sheet in CSV format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IAPAgingSummaryQuery
  ): Promise<string> {
    const table = await this.APAgingSummaryTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
