import {
  IInventoryTransaction,
  IItemWarehouseQuantityChange,
} from '@/interfaces';
import { set, get, chain, toPairs } from 'lodash';

export class WarehousesItemsQuantity {
  balanceMap: { [warehouseId: number]: { [itemId: number]: number } } = {};
  /**
   *
   * @param   {number} warehouseId
   * @param   {number} itemId
   * @returns {number}
   */
  public get = (warehouseId: number, itemId: number): number => {
    return get(this.balanceMap, `${warehouseId}.${itemId}`, 0);
  };

  /**
   *
   * @param   {number} warehouseId
   * @param   {number} itemId
   * @param   {number} amount
   * @returns {WarehousesItemsQuantity}
   */
  public set = (warehouseId: number, itemId: number, amount: number) => {
    if (!get(this.balanceMap, warehouseId)) {
      set(this.balanceMap, warehouseId, {});
    }
    set(this.balanceMap, `${warehouseId}.${itemId}`, amount);

    return this;
  };

  /**
   *
   * @param   {number} warehouseId
   * @param   {number} itemId
   * @param   {number} amount
   * @returns {WarehousesItemsQuantity}
   */
  public increment = (warehouseId: number, itemId: number, amount: number) => {
    const oldAmount = this.get(warehouseId, itemId);

    return this.set(warehouseId, itemId, oldAmount + amount);
  };

  /**
   *
   * @param   {number} warehouseId
   * @param   {number} itemId
   * @param   {number} amount
   * @returns {WarehousesItemsQuantity}
   */
  public decrement = (warehouseId: number, itemId: number, amount: number) => {
    const oldAmount = this.get(warehouseId, itemId);

    return this.set(warehouseId, itemId, oldAmount - amount);
  };

  /**
   *
   * @returns {WarehousesItemsQuantity}
   */
  public reverse = () => {
    const collection = this.toArray();

    collection.forEach((change) => {
      this.set(change.warehouseId, change.itemId, change.amount * -1);
    });
    return this;
  };

  /**
   *
   * @returns {IItemWarehouseQuantityChange[]}
   */
  public toArray = (): IItemWarehouseQuantityChange[] => {
    return chain(this.balanceMap)
      .toPairs()
      .map(([warehouseId, item]) => {
        const pairs = toPairs(item);

        return pairs.map(([itemId, amount]) => ({
          itemId: parseInt(itemId),
          warehouseId: parseInt(warehouseId),
          amount,
        }));
      })
      .flatten()
      .value();
  };

  /**
   *
   * @param   {IInventoryTransaction[]} inventoryTransactions
   * @returns {WarehousesItemsQuantity}
   */
  static fromInventoryTransaction = (
    inventoryTransactions: IInventoryTransaction[]
  ): WarehousesItemsQuantity => {
    const warehouseTransactions = inventoryTransactions.filter(
      (transaction) => transaction.warehouseId
    );
    const warehouseItemsQuantity = new WarehousesItemsQuantity();

    warehouseTransactions.forEach((transaction: IInventoryTransaction) => {
      const change =
        transaction.direction === 'IN'
          ? warehouseItemsQuantity.increment
          : warehouseItemsQuantity.decrement;

      change(transaction.warehouseId, transaction.itemId, transaction.quantity);
    });
    return warehouseItemsQuantity;
  };
}
