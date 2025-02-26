import { InventoryTransaction } from '@/modules/InventoryCost/models/InventoryTransaction';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { omit } from 'lodash';
import { IItemWarehouseQuantityChange } from '../Warehouse.types';
import { WarehousesItemsQuantity } from './WarehousesItemsQuantity';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ItemWarehouseQuantity } from '../models/ItemWarehouseQuantity';

@Injectable()
export class WarehousesItemsQuantitySync {
  constructor(
    private readonly warehouseItemsQuantityModel: WarehousesItemsQuantity,
    private readonly itemWarehouseQuantityModel: TenantModelProxy<
      typeof ItemWarehouseQuantity
    >,
  ) {}

  /**
   * Retrieves the reversed warehouses items quantity changes.
   * @param {InventoryTransaction[]} inventoryTransactions
   * @returns {IItemWarehouseQuantityChange[]}
   */
  public getReverseWarehousesItemsQuantityChanges = (
    inventoryTransactions: InventoryTransaction[],
  ): IItemWarehouseQuantityChange[] => {
    const warehouseItemsQuantity =
      WarehousesItemsQuantity.fromInventoryTransaction(inventoryTransactions);

    return warehouseItemsQuantity.reverse().toArray();
  };

  /**
   * Retrieves the warehouses items changes from the given inventory tranasctions.
   * @param {InventoryTransaction[]} inventoryTransactions
   * @returns {IItemWarehouseQuantityChange[]}
   */
  public getWarehousesItemsQuantityChange = (
    inventoryTransactions: InventoryTransaction[],
  ): IItemWarehouseQuantityChange[] => {
    const warehouseItemsQuantity =
      WarehousesItemsQuantity.fromInventoryTransaction(inventoryTransactions);

    return warehouseItemsQuantity.toArray();
  };

  /**
   * Mutates warehouses items quantity on hand on the storage.
   * @param {IItemWarehouseQuantityChange[]} warehousesItemsQuantity
   * @param {Knex.Transaction} trx
   */
  public mutateWarehousesItemsQuantity = async (
    warehousesItemsQuantity: IItemWarehouseQuantityChange[],
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const mutationsOpers = warehousesItemsQuantity.map(
      (change: IItemWarehouseQuantityChange) =>
        this.mutateWarehouseItemQuantity(change, trx),
    );
    await Promise.all(mutationsOpers);
  };

  /**
   * Mutates the warehouse item quantity.
   * @param {number} warehouseItemQuantity
   * @param {Knex.Transaction} trx
   */
  public mutateWarehouseItemQuantity = async (
    warehouseItemQuantity: IItemWarehouseQuantityChange,
    trx: Knex.Transaction,
  ): Promise<void> => {
    const itemWarehouseQuantity = await this.itemWarehouseQuantityModel()
      .query(trx)
      .where('itemId', warehouseItemQuantity.itemId)
      .where('warehouseId', warehouseItemQuantity.warehouseId)
      .first();

    if (itemWarehouseQuantity) {
      // @ts-ignore
      await ItemWarehouseQuantity.changeAmount(
        {
          itemId: warehouseItemQuantity.itemId,
          warehouseId: warehouseItemQuantity.warehouseId,
        },
        'quantityOnHand',
        warehouseItemQuantity.amount,
        trx,
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
    inventoryTransactions: InventoryTransaction[],
    trx?: Knex.Transaction,
  ) => {
    const changes = this.getWarehousesItemsQuantityChange(
      inventoryTransactions,
    );
    await this.mutateWarehousesItemsQuantity(changes, trx);
  };

  /**
   * Reverses warehouses items quantity from inventory transactions.
   * @param {number} tenantId
   * @param {IInventoryTransaction[]} inventoryTransactions
   * @param {Knex.Transaction} trx
   */
  public reverseWarehousesItemsQuantityFromTransactions = async (
    inventoryTransactions: InventoryTransaction[],
    trx?: Knex.Transaction,
  ) => {
    const changes = this.getReverseWarehousesItemsQuantityChanges(
      inventoryTransactions,
    );
    await this.mutateWarehousesItemsQuantity(changes, trx);
  };
}
