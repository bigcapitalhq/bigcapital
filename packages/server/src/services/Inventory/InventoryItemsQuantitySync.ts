import { Inject, Service } from 'typedi';
import { toSafeInteger } from 'lodash';
import { IInventoryTransaction, IItemsQuantityChanges } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import Knex from 'knex';

/**
 * Syncs the inventory transactions with inventory items quantity.
 */
@Service()
export default class InventoryItemsQuantitySync {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Reverse the given inventory transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions
   * @return {IInventoryTransaction[]}
   */
  reverseInventoryTransactions(
    inventoryTransactions: IInventoryTransaction[]
  ): IInventoryTransaction[] {
    return inventoryTransactions.map((transaction) => ({
      ...transaction,
      direction: transaction.direction === 'OUT' ? 'IN' : 'OUT',
    }));
  }

  /**
   * Reverses the inventory transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions -
   * @return {IItemsQuantityChanges[]}
   */
  getReverseItemsQuantityChanges(
    inventoryTransactions: IInventoryTransaction[]
  ): IItemsQuantityChanges[] {
    const reversedTransactions = this.reverseInventoryTransactions(
      inventoryTransactions
    );
    return this.getItemsQuantityChanges(reversedTransactions);
  }

  /**
   * Retrieve the items quantity changes from the given inventory transactions.
   * @param {IInventoryTransaction[]} inventoryTransactions - Inventory transactions.
   * @return {IItemsQuantityChanges[]}
   */
  getItemsQuantityChanges(
    inventoryTransactions: IInventoryTransaction[]
  ): IItemsQuantityChanges[] {
    const balanceMap: { [itemId: number]: number } = {};

    inventoryTransactions.forEach(
      (inventoryTransaction: IInventoryTransaction) => {
        const { itemId, direction, quantity } = inventoryTransaction;

        if (!balanceMap[itemId]) {
          balanceMap[itemId] = 0;
        }
        balanceMap[itemId] += direction === 'IN' ? quantity : 0;
        balanceMap[itemId] -= direction === 'OUT' ? quantity : 0;
      }
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
  async changeItemsQuantity(
    tenantId: number,
    itemsQuantity: IItemsQuantityChanges[],
    trx?: Knex.Transaction
  ): Promise<void> {
    const { itemRepository } = this.tenancy.repositories(tenantId);
    const opers = [];

    itemsQuantity.forEach((itemQuantity: IItemsQuantityChanges) => {
      const changeQuantityOper = itemRepository.changeNumber(
        { id: itemQuantity.itemId, type: 'inventory' },
        'quantityOnHand',
        itemQuantity.balanceChange,
        trx
      );
      opers.push(changeQuantityOper);
    });
    await Promise.all(opers);
  }
}
