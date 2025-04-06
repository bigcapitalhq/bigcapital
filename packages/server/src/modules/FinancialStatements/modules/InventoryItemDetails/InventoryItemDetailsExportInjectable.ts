import { InventoryDetailsTableInjectable } from './InventoryItemDetailsTableInjectable';
import { Injectable } from '@nestjs/common';
import { IInventoryDetailsQuery } from './InventoryItemDetails.types';
import { TableSheet } from '../../common/TableSheet';

@Injectable()
export class InventoryItemDetailsExportInjectable {
  constructor(
    private readonly inventoryDetailsTable: InventoryDetailsTableInjectable,
  ) {}

  /**
   * Retrieves the trial balance sheet in XLSX format.
   * @param {IInventoryDetailsQuery} query - Inventory details query.
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IInventoryDetailsQuery) {
    const table = await this.inventoryDetailsTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieves the trial balance sheet in CSV format.
   * @param {IInventoryDetailsQuery} query - Inventory details query.
   * @returns {Promise<Buffer>}
   */
  public async csv(query: IInventoryDetailsQuery): Promise<string> {
    const table = await this.inventoryDetailsTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToCSV();

    return tableCsv;
  }
}
