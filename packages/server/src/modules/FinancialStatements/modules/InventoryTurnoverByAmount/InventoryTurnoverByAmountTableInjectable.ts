import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { InventoryTurnoverByAmountService } from './InventoryTurnoverByAmount.service';
import { InventoryTurnoverByAmountTable } from './InventoryTurnoverByAmountTable';
import {
  IInventoryTurnoverByAmountQuery,
  IInventoryTurnoverByAmountTable,
} from './InventoryTurnoverByAmount.types';

@Injectable()
export class InventoryTurnoverByAmountTableInjectable {
  constructor(
    private readonly sheet: InventoryTurnoverByAmountService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the inventory turnover report in table format.
   * @param {IInventoryTurnoverByAmountQuery} filter
   * @returns {Promise<IInventoryTurnoverByAmountTable>}
   */
  public async table(
    filter: IInventoryTurnoverByAmountQuery,
  ): Promise<IInventoryTurnoverByAmountTable> {
    const { data, query, meta } =
      await this.sheet.inventoryTurnoverByAmount(filter);

    const table = new InventoryTurnoverByAmountTable(data, this.i18n);

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
