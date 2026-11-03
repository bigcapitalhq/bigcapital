import { Injectable } from '@nestjs/common';
import { TableSheet } from '../../common/TableSheet';
import { InventoryTurnoverByAmountTableInjectable } from './InventoryTurnoverByAmountTableInjectable';
import { IInventoryTurnoverByAmountQuery } from './InventoryTurnoverByAmount.types';

@Injectable()
export class InventoryTurnoverByAmountExportable {
  constructor(
    private readonly inventoryTurnoverByAmountTable: InventoryTurnoverByAmountTableInjectable,
  ) {}

  /**
   * Retrieve the inventory turnover report in XLSX format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<Buffer>}
   */
  public async xlsx(query: IInventoryTurnoverByAmountQuery): Promise<Buffer> {
    const table = await this.inventoryTurnoverByAmountTable.table(query);

    const tableSheet = new TableSheet(table.table);
    const tableCsv = tableSheet.convertToXLSX();

    return tableSheet.convertToBuffer(tableCsv, 'xlsx');
  }

  /**
   * Retrieve the inventory turnover report in CSV format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<string>}
   */
  public async csv(query: IInventoryTurnoverByAmountQuery): Promise<string> {
    const table = await this.inventoryTurnoverByAmountTable.table(query);

    const tableSheet = new TableSheet(table.table);

    return tableSheet.convertToCSV();
  }
}
