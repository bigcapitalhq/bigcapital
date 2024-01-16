import { Inject, Service } from 'typedi';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';

@Service()
export class SalesByItemsExport {
  @Inject()
  private salesByItemsTable: SalesByItemsTableInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: ISalesByItemsReportQuery) {
    const table = await this.salesByItemsTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: ISalesByItemsReportQuery
  ): Promise<string> {
    const table = await this.salesByItemsTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
