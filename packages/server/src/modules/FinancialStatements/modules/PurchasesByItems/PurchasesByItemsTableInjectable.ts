import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsTable,
} from './types/PurchasesByItems.types';
import { PurchasesByItemsService } from './PurchasesByItems.service';
import { PurchasesByItemsTable } from './PurchasesByItemsTable';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class PurchasesByItemsTableInjectable {
  constructor(
    private readonly purchasesByItemsSheet: PurchasesByItemsService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the purchases by items table format.
   * @param {IPurchasesByItemsReportQuery} filter - The filter to be used.
   * @returns {Promise<IPurchasesByItemsTable>} - The purchases by items table.
   */
  public async table(
    filter: IPurchasesByItemsReportQuery,
  ): Promise<IPurchasesByItemsTable> {
    const { data, query, meta } =
      await this.purchasesByItemsSheet.purchasesByItems(filter);

    const table = new PurchasesByItemsTable(data, this.i18n);

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
