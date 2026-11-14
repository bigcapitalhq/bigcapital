import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Batch } from './models/Batch';
import { toBatchQuantity } from './Batches.utils';

export interface IBatchQuantityChange {
  batchId: number;
  balanceChange: number;
}

/**
 * Syncs the inventory transactions with the batches quantity on hand.
 */
@Injectable()
export class BatchesQuantitySyncService {
  /**
   * @param {TenantModelProxy<typeof Batch>} batchModel - Batch model.
   */
  constructor(
    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,
  ) {}

  /**
   * Retrieves the batch quantity changes from the given inventory transactions.
   * @param {InventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @return {IBatchQuantityChange[]}
   */
  public getBatchesQuantityChanges(
    inventoryTransactions: InventoryTransaction[],
  ): IBatchQuantityChange[] {
    const balanceChanges = new Map<number, number>();

    inventoryTransactions.forEach((transaction) => {
      if (transaction.batchId === null || transaction.batchId === undefined) {
        return;
      }
      const batchId = Number(transaction.batchId);
      const quantity = toBatchQuantity(transaction.quantity);
      const balanceChange =
        transaction.direction === 'IN' ? quantity : -quantity;

      balanceChanges.set(
        batchId,
        toBatchQuantity((balanceChanges.get(batchId) ?? 0) + balanceChange),
      );
    });

    return [...balanceChanges.entries()]
      .map(([batchId, balanceChange]) => ({ batchId, balanceChange }))
      .filter((change) => change.balanceChange !== 0);
  }

  /**
   * Retrieves the reversed batch quantity changes.
   * @param {InventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @return {IBatchQuantityChange[]}
   */
  public getReverseBatchesQuantityChanges(
    inventoryTransactions: InventoryTransaction[],
  ): IBatchQuantityChange[] {
    return this.getBatchesQuantityChanges(inventoryTransactions).map(
      (change) => ({
        batchId: change.batchId,
        balanceChange: -change.balanceChange,
      }),
    );
  }

  /**
   * Changes the batches quantity on hand.
   * @param {IBatchQuantityChange[]} batchesQuantity - Batch quantity changes.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  public async changeBatchesQuantity(
    batchesQuantity: IBatchQuantityChange[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Applying the changes in a deterministic order avoids deadlocks when a
    // single transaction touches multiple batches.
    const sortedChanges = [...batchesQuantity].sort(
      (a, b) => a.batchId - b.batchId,
    );

    for (const change of sortedChanges) {
      if (!change.balanceChange) {
        continue;
      }
      const query = this.batchModel().query(trx).where('id', change.batchId);

      if (change.balanceChange > 0) {
        await query.increment('quantityOnHand', change.balanceChange);
      } else {
        await query.decrement('quantityOnHand', Math.abs(change.balanceChange));
      }
    }
  }

  /**
   * Mutates the batches quantity on hand from the given inventory transactions.
   * @param {InventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  public async mutateBatchesQuantityFromTransactions(
    inventoryTransactions: InventoryTransaction[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.changeBatchesQuantity(
      this.getBatchesQuantityChanges(inventoryTransactions),
      trx,
    );
  }

  /**
   * Reverses the batches quantity on hand from the given inventory transactions.
   * @param {InventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @return {Promise<void>}
   */
  public async reverseBatchesQuantityFromTransactions(
    inventoryTransactions: InventoryTransaction[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    await this.changeBatchesQuantity(
      this.getReverseBatchesQuantityChanges(inventoryTransactions),
      trx,
    );
  }
}
