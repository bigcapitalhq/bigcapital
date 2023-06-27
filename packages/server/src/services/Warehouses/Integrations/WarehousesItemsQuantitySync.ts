import { Knex } from 'knex';
import { Service, Inject } from 'typedi';
import { omit } from 'lodash';
import {
  IInventoryTransaction,
  IItemWarehouseQuantityChange,
} from '@/interfaces';
import { WarehousesItemsQuantity } from './WarehousesItemsQuantity';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class WarehousesItemsQuantitySync {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Retrieves the reversed warehouses items quantity changes.
   * @param   {IInventoryTransaction[]} inventoryTransactions
   * @returns {IItemWarehouseQuantityChange[]}
   */
  public getReverseWarehousesItemsQuantityChanges = (
    inventoryTransactions: IInventoryTransaction[]
  ): IItemWarehouseQuantityChange[] => {
    const warehouseItemsQuantity =
      WarehousesItemsQuantity.fromInventoryTransaction(inventoryTransactions);

    return warehouseItemsQuantity.reverse().toArray();
  };

  /**
   * Retrieves the warehouses items changes from the given inventory transactions.
   * @param   {IInventoryTransaction[]} inventoryTransactions
   * @returns {IItemWarehouseQuantityChange[]}
   */
  public getWarehousesItemsQuantityChange = (
    inventoryTransactions: IInventoryTransaction[]
  ): IItemWarehouseQuantityChange[] => {
    const warehouseItemsQuantity =
      WarehousesItemsQuantity.fromInventoryTransaction(inventoryTransactions);

    return warehouseItemsQuantity.toArray();
  };

  /**
   * Mutates warehouses items quantity on hand on the storage.
   * @param {number} tenantId
   * @param {IItemWarehouseQuantityChange[]} warehousesItemsQuantity
   * @param {Knex.Transaction} trx
   */
  public mutateWarehousesItemsQuantity = async (
    tenantId: number,
    warehousesItemsQuantity: IItemWarehouseQuantityChange[],
    trx?: Knex.Transaction
  ): Promise<void> => {
    const mutationsOpers = warehousesItemsQuantity.map(
      (change: IItemWarehouseQuantityChange) =>
        this.mutateWarehouseItemQuantity(tenantId, change, trx)
    );
    await Promise.all(mutationsOpers);
  };

  /**
   * Mutates the warehouse item quantity.
   * @param {number} tenantId
   * @param {number} warehouseItemQuantity
   * @param {Knex.Transaction} trx
   */
  public mutateWarehouseItemQuantity = async (
    tenantId: number,
    warehouseItemQuantity: IItemWarehouseQuantityChange,
    trx: Knex.Transaction
  ): Promise<void> => {
    const { ItemWarehouseQuantity } = this.tenancy.models(tenantId);

    const itemWarehouseQuantity = await ItemWarehouseQuantity.query(trx)
      .where('itemId', warehouseItemQuantity.itemId)
      .where('warehouseId', warehouseItemQuantity.warehouseId)
      .first();

    if (itemWarehouseQuantity) {
      await ItemWarehouseQuantity.changeAmount(
        {
          itemId: warehouseItemQuantity.itemId,
          warehouseId: warehouseItemQuantity.warehouseId,
        },
        'quantityOnHand',
        warehouseItemQuantity.amount,
        trx
      );
    } else {
      await ItemWarehouseQuantity.query(trx).insert({
        ...omit(warehouseItemQuantity, ['amount']),
        quantityOnHand: warehouseItemQuantity.amount,
      });
    }
  };

  /**
   * Mutates warehouses items quantity from inventory transactions.
   * @param {number} tenantId -
   * @param {IInventoryTransaction[]} inventoryTransactions -
   * @param {Knex.Transaction}
   */
  public mutateWarehousesItemsQuantityFromTransactions = async (
    tenantId: number,
    inventoryTransactions: IInventoryTransaction[],
    trx?: Knex.Transaction
  ) => {
    const changes = this.getWarehousesItemsQuantityChange(
      inventoryTransactions
    );
    await this.mutateWarehousesItemsQuantity(tenantId, changes, trx);
  };

  /**
   * Reverses warehouses items quantity from inventory transactions.
   * @param {number} tenantId
   * @param {IInventoryTransaction[]} inventoryTransactions
   * @param {Knex.Transaction} trx
   */
  public reverseWarehousesItemsQuantityFromTransactions = async (
    tenantId: number,
    inventoryTransactions: IInventoryTransaction[],
    trx?: Knex.Transaction
  ) => {
    const changes = this.getReverseWarehousesItemsQuantityChanges(
      inventoryTransactions
    );
    await this.mutateWarehousesItemsQuantity(tenantId, changes, trx);
  };
}
