import { Inject, Service } from 'typedi';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { IInventoryValuationReportQuery } from '@/interfaces';
import { InventoryValuationSheetTable } from './InventoryValuationSheetTable';

@Service()
export class InventoryValuationSheetTableInjectable {
  @Inject()
  private sheet: InventoryValuationSheetService;

  /**
   * 
   * @param {number} tenantId 
   * @param {} filter 
   * @returns 
   */
  async table(tenantId: number, filter: IInventoryValuationReportQuery) {
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
