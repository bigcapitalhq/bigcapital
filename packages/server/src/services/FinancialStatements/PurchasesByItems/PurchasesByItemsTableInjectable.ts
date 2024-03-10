import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsTable,
} from '@/interfaces/PurchasesByItemsSheet';
import { Inject, Service } from 'typedi';
import { PurchasesByItemsService } from './PurchasesByItemsService';
import { PurchasesByItemsTable } from './PurchasesByItemsTable';

@Service()
export class PurchasesByItemsTableInjectable {
  @Inject()
  private purchasesByItemsSheet: PurchasesByItemsService;

  /**
   * Retrieves the purchases by items table format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} filter
   * @returns {Promise<IPurchasesByItemsTable>}
   */
  public async table(
    tenantId: number,
    filter: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsTable> {
    const { data, query, meta } =
      await this.purchasesByItemsSheet.purchasesByItems(tenantId, filter);

    const table = new PurchasesByItemsTable(data);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableData(),
      },
      meta,
      query,
    };
  }
}
