import { Inject, Service } from 'typedi';
import { IInventoryValuationReportQuery } from '@/interfaces';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { TableSheet } from '@/lib/Xlsx/TableSheet';

@Service()
export class InventoryValuationSheetExportable {
  @Inject()
  private inventoryValuationTable: InventoryValuationSheetTableInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<Buffer> {
    const table = await this.inventoryValuationTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<string> {
    const table = await this.inventoryValuationTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
