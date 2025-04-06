import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  IInventoryDetailsQuery,
  IInvetoryItemDetailsTable,
} from './InventoryItemDetails.types';
import { InventoryDetailsService } from './InventoryItemDetails.service';
import { InventoryItemDetailsTable } from './InventoryItemDetailsTable';

@Injectable()
export class InventoryDetailsTableInjectable {
  constructor(
    private readonly inventoryDetails: InventoryDetailsService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the inventory item details in table format.
   * @param {IInventoryDetailsQuery} query - Inventory details query.
   * @returns {Promise<IInvetoryItemDetailsTable>}
   */
  public async table(
    query: IInventoryDetailsQuery,
  ): Promise<IInvetoryItemDetailsTable> {
    const inventoryDetails =
      await this.inventoryDetails.inventoryDetails(query);

    const table = new InventoryItemDetailsTable(inventoryDetails.data, this.i18n);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: inventoryDetails.query,
      meta: inventoryDetails.meta,
    };
  }
}
