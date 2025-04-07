import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationTable,
} from './InventoryValuationSheet.types';
import { InventoryValuationSheetTable } from './InventoryValuationSheetTable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryValuationSheetTableInjectable {
  constructor(private readonly sheet: InventoryValuationSheetService) {}

  /**
   * Retrieves the inventory valuation json table format.
   * @param {IInventoryValuationReportQuery} filter -
   * @returns {Promise<IInventoryValuationTable>}
   */
  public async table(
    filter: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationTable> {
    const { data, query, meta } =
      await this.sheet.inventoryValuationSheet(filter);
    const table = new InventoryValuationSheetTable(data);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query,
      meta,
    };
  }
}
