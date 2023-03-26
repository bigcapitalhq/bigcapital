import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import { IItem, IItemWarehouseQuantityChange } from '@/interfaces';
import { WarehousesItemsQuantitySync } from './Integrations/WarehousesItemsQuantitySync';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class CreateInitialWarehousesItemsQuantity {
  @Inject()
  private warehousesItemsQuantitySync: WarehousesItemsQuantitySync;

  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Retrieves items warehouses quantity changes of the given inventory items.
   * @param {IItem[]} items
   * @param {IWarehouse} primaryWarehouse
   * @returns {IItemWarehouseQuantityChange[]}
   */
  private getWarehousesItemsChanges = (
    items: IItem[],
    primaryWarehouseId: number
  ): IItemWarehouseQuantityChange[] => {
    return items
      .filter((item: IItem) => item.quantityOnHand)
      .map((item: IItem) => ({
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
    tenantId: number,
    primaryWarehouseId: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { Item } = this.tenancy.models(tenantId);

    const items = await Item.query(trx).where('type', 'Inventory');

    const warehousesChanges = this.getWarehousesItemsChanges(
      items,
      primaryWarehouseId
    );
    await this.warehousesItemsQuantitySync.mutateWarehousesItemsQuantity(
      tenantId,
      warehousesChanges,
      trx
    );
  };
}
