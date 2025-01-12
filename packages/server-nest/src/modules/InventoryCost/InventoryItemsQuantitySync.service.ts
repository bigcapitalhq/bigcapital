import { toSafeInteger } from 'lodash';
import { IInventoryTransaction, IItemsQuantityChanges } from '@/interfaces';
import { Knex } from 'knex';
import { Inject } from '@nestjs/common';
import { Item } from '../Items/models/Item';
import { Injectable } from '@nestjs/common';

/**
 * Syncs the inventory transactions with inventory items quantity.
 */
@Injectable()
export class InventoryItemsQuantitySyncService {
  constructor(
    @Inject(Item.name)
    private readonly itemModel: typeof Item,
  ) {}

  /**
   * Reverse the given inventory transactions.
   * @param {IInventoryTransaction[]} inventroyTransactions
   * @return {IInventoryTransaction[]}
   */
  public reverseInventoryTransactions(
    inventroyTransactions: IInventoryTransaction[],
  ): IInventoryTransaction[] {
    return inventroyTransactions.map((transaction) => ({
      ...transaction,
      direction: transaction.direction === 'OUT' ? 'IN' : 'OUT',
    }));
  }

  /**
   * Reverses the inventory transactions.
   * @param {IInventoryTransaction[]} inventroyTransactions -
   * @return {IItemsQuantityChanges[]}
   */
  public getReverseItemsQuantityChanges(
    inventroyTransactions: IInventoryTransaction[],
  ): IItemsQuantityChanges[] {
    const reversedTransactions = this.reverseInventoryTransactions(
      inventroyTransactions,
    );
    return this.getItemsQuantityChanges(reversedTransactions);
  }

  /**
   * Retrieve the items quantity changes from the given inventory transactions.
   * @param {IInventoryTransaction[]} inventroyTransactions - Inventory transactions.
   * @return {IItemsQuantityChanges[]}
   */
  public getItemsQuantityChanges(
    inventroyTransactions: IInventoryTransaction[],
  ): IItemsQuantityChanges[] {
    const balanceMap: { [itemId: number]: number } = {};

    inventroyTransactions.forEach(
      (inventoryTransaction: IInventoryTransaction) => {
        const { itemId, direction, quantity } = inventoryTransaction;

        if (!balanceMap[itemId]) {
          balanceMap[itemId] = 0;
        }
        balanceMap[itemId] += direction === 'IN' ? quantity : 0;
        balanceMap[itemId] -= direction === 'OUT' ? quantity : 0;
      },
    );
    return Object.entries(balanceMap).map(([itemId, balanceChange]) => ({
      itemId: toSafeInteger(itemId),
      balanceChange,
    }));
  }

  /**
   * Changes the items quantity changes.
   * @param {IItemsQuantityChanges[]} itemsQuantity - Items quantity changes.
   * @return {Promise<void>}
   */
  public async changeItemsQuantity(
    itemsQuantity: IItemsQuantityChanges[],
    trx?: Knex.Transaction,
  ): Promise<void> {
    const opers = [];

    itemsQuantity.forEach((itemQuantity: IItemsQuantityChanges) => {
      const changeQuantityOper = this.itemModel
        .query(trx)
        .where({ id: itemQuantity.itemId, type: 'inventory' })
        .modify('quantityOnHand', itemQuantity.balanceChange);

      opers.push(changeQuantityOper);
    });
    await Promise.all(opers);
  }
}
