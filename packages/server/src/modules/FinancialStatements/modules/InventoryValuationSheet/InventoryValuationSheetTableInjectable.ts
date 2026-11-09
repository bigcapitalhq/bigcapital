import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationTable,
} from './InventoryValuationSheet.types';
import { InventoryValuationSheetTable } from './InventoryValuationSheetTable';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class InventoryValuationSheetTableInjectable {
  constructor(
    private readonly sheet: InventoryValuationSheetService,
    private readonly i18n: I18nService,
  ) {}

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
    const table = new InventoryValuationSheetTable(data, this.i18n);

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
