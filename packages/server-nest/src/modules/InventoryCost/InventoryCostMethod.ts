import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { omit } from 'lodash';
import { InventoryCostLotTracker } from './models/InventoryCostLotTracker';

export class InventoryCostMethod {
  constructor(
    @Inject(InventoryCostLotTracker.name)
    private readonly inventoryCostLotTracker: typeof InventoryCostLotTracker,
  ) {}

  /**
   * Stores the inventory lots costs transactions in bulk.
   * @param {InventoryCostLotTracker[]} costLotsTransactions - Inventory lots costs transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<object>}
   */
  public storeInventoryLotsCost(
    costLotsTransactions: InventoryCostLotTracker[],
    trx: Knex.Transaction,
  ): Promise<object> {
    const opers: any = [];

    costLotsTransactions.forEach((transaction: any) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = this.inventoryCostLotTracker
          .query(trx)
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);

        opers.push(decrementOper);
      } else if (!transaction.lotTransId) {
        const operation = this.inventoryCostLotTracker.query(trx).insert({
          ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
        });
        opers.push(operation);
      }
    });
    return Promise.all(opers);
  }
}
