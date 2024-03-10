import { Inject, Service } from 'typedi';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import {
  IInventoryValuationReportQuery,
  IInventoryValuationTable,
} from '@/interfaces';
import { InventoryValuationSheetTable } from './InventoryValuationSheetTable';

@Service()
export class InventoryValuationSheetTableInjectable {
  @Inject()
  private sheet: InventoryValuationSheetService;

  /**
   * Retrieves the inventory valuation json table format.
   * @param {number} tenantId -
   * @param {IInventoryValuationReportQuery} filter -
   * @returns {Promise<IInventoryValuationTable>}
   */
  public async table(
    tenantId: number,
    filter: IInventoryValuationReportQuery
  ): Promise<IInventoryValuationTable> {
    const { data, query, meta } = await this.sheet.inventoryValuationSheet(
      tenantId,
      filter
    );
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
