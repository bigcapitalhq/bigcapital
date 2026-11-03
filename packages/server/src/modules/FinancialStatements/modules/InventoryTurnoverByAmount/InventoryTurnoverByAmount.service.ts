import { Injectable } from '@nestjs/common';
import { InventoryTurnoverByAmount } from './InventoryTurnoverByAmount';
import { InventoryTurnoverByAmountRepository } from './InventoryTurnoverByAmountRepository';
import { InventoryTurnoverByAmountMeta } from './InventoryTurnoverByAmountMeta';
import { getInventoryTurnoverByAmountDefaultQuery } from './_constants';
import {
  IInventoryTurnoverByAmountQuery,
  IInventoryTurnoverByAmountSheet,
} from './InventoryTurnoverByAmount.types';

@Injectable()
export class InventoryTurnoverByAmountService {
  constructor(
    private readonly inventoryTurnoverByAmountMeta: InventoryTurnoverByAmountMeta,
    private readonly inventoryTurnoverByAmountRepository: InventoryTurnoverByAmountRepository,
  ) {}

  /**
   * Retrieve the inventory turnover by amount report.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<IInventoryTurnoverByAmountSheet>}
   */
  public async inventoryTurnoverByAmount(
    query: IInventoryTurnoverByAmountQuery,
  ): Promise<IInventoryTurnoverByAmountSheet> {
    const filter = {
      ...getInventoryTurnoverByAmountDefaultQuery(),
      ...query,
    };

    this.inventoryTurnoverByAmountRepository.setFilter(filter);
    await this.inventoryTurnoverByAmountRepository.asyncInit();

    const meta = await this.inventoryTurnoverByAmountMeta.meta(filter);

    const inventoryTurnoverByAmountInstance = new InventoryTurnoverByAmount(
      filter,
      this.inventoryTurnoverByAmountRepository,
      {
        baseCurrency: meta.baseCurrency,
        dateFormat: meta.dateFormat,
      },
    );

    return {
      data: inventoryTurnoverByAmountInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
