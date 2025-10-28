import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { InventoryCostLotTracker } from '../models/InventoryCostLotTracker';
import { TenantModelProxy } from '../../System/models/TenantBaseModel';

@Injectable()
export class StoreInventoryLotsCostService {
  constructor(
    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: TenantModelProxy<
      typeof InventoryCostLotTracker
    >,
  ) {}

  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param {InventoryCostLotTracker[]} costLotsTransactions - Inventory lots costs transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<object>}
   */
  public storeInventoryLotsCost(
    costLotsTransactions: InventoryCostLotTracker[],
    trx?: Knex.Transaction,
  ): Promise<object> {
    const opers: any = [];

    costLotsTransactions.forEach((transaction: any) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = this.inventoryCostLotTracker()
          .query(trx)
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);

        opers.push(decrementOper);
      } else if (!transaction.lotTransId) {
        const operation = this.inventoryCostLotTracker()
          .query(trx)
          .insert({
            ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
          });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }

  /**
   * Reverts the inventory lots `OUT` transactions.
   * @param {Date} startingDate - Starting date.
   * @param {number} itemId - Item id.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<void>}
   */
  async revertInventoryCostLotTransactions(
    startingDate: Date,
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.inventoryCostLotTracker()
      .query(trx)
      .modify('filterDateRange', startingDate)
      .orderBy('date', 'DESC')
      .where('item_id', itemId)
      .delete();
  }
}
