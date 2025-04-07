import { Knex } from 'knex';
import { WarehousesItemsQuantitySync } from './Integrations/WarehousesItemsQuantitySync';
import { Inject, Injectable } from '@nestjs/common';
import { IItemWarehouseQuantityChange } from './Warehouse.types';
import { Item } from '../Items/models/Item';
import { TenantModelProxy } from '../System/models/TenantBaseModel';

@Injectable()
export class CreateInitialWarehousesItemsQuantity {
  constructor(
    private readonly warehousesItemsQuantitySync: WarehousesItemsQuantitySync,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Retrieves items warehouses quantity changes of the given inventory items.
   * @param {IItem[]} items
   * @param {IWarehouse} primaryWarehouse
   * @returns {IItemWarehouseQuantityChange[]}
   */
  private getWarehousesItemsChanges = (
    items: Item[],
    primaryWarehouseId: number,
  ): IItemWarehouseQuantityChange[] => {
    return items
      .filter((item: Item) => item.quantityOnHand)
      .map((item: Item) => ({
        itemId: item.id,
        warehouseId: primaryWarehouseId,
        amount: item.quantityOnHand,
      }));
  };

  /**
   * Creates initial warehouses items quantity.
   * @param {number} tenantId
   */
  public run = async (
    primaryWarehouseId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const items = await this.itemModel().query(trx).where('type', 'Inventory');

    const warehousesChanges = this.getWarehousesItemsChanges(
      items,
      primaryWarehouseId,
    );
    await this.warehousesItemsQuantitySync.mutateWarehousesItemsQuantity(
      warehousesChanges,
      trx,
    );
  };
}
