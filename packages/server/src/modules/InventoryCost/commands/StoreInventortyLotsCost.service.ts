import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { chunk, omit } from 'lodash';
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
   * @return {Promise<void>}
   */
  public async storeInventoryLotsCost(
    costLotsTransactions: InventoryCostLotTracker[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const decrementOpers: any[] = [];
    const insertRows: any[] = [];

    costLotsTransactions.forEach((transaction: any) => {
      if (transaction.lotTransId && transaction.decrement) {
        const decrementOper = this.inventoryCostLotTracker()
          .query(trx)
          .where('id', transaction.lotTransId)
          .decrement('remaining', transaction.decrement);

        decrementOpers.push(decrementOper);
      } else if (!transaction.lotTransId) {
        insertRows.push({
          ...omit(transaction, ['decrement', 'invTransId', 'lotTransId']),
        });
      }
    });
    await Promise.all(decrementOpers);

    // Insert the cost lots in chunks to avoid a large number of concurrent
    // queries when re-computing a long item history.
    for (const rows of chunk(insertRows, 500)) {
      await this.inventoryCostLotTracker().query(trx).insert(rows);
    }
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
