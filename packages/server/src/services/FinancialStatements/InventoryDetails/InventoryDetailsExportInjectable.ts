import { Inject, Service } from 'typedi';
import { IInventoryDetailsQuery } from '@/interfaces';
import { TableSheet } from '@/lib/Xlsx/TableSheet';
import { InventoryDetailsTableInjectable } from './InventoryDetailsTableInjectable';

@Service()
export class InventoryDetailsExportInjectable {
  @Inject()
  private inventoryDetailsTable: InventoryDetailsTableInjectable;

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(tenantId: number, query: IInventoryDetailsQuery) {
    const table = await this.inventoryDetailsTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public async csv(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<string> {
    const table = await this.inventoryDetailsTable.table(tenantId, query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
