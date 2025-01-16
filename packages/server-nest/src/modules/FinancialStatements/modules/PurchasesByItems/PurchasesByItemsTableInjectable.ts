import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsTable,
} from './types/PurchasesByItems.types';
import { PurchasesByItemsService } from './PurchasesByItemsService';
import { PurchasesByItemsTable } from './PurchasesByItemsTable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PurchasesByItemsTableInjectable {
  constructor(
    private readonly purchasesByItemsSheet: PurchasesByItemsService,
  ) {}

  /**
   * Retrieves the purchases by items table format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} filter
   * @returns {Promise<IPurchasesByItemsTable>}
   */
  public async table(
    filter: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsTable> {
    const { data, query, meta } =
      await this.purchasesByItemsSheet.purchasesByItems(filter);

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
