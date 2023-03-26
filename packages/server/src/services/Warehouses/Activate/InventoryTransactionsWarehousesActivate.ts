import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class InventoryActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateInventoryTransactionsWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { InventoryTransaction, InventoryCostLotTracker } =
      this.tenancy.models(tenantId);

    // Updates the inventory transactions with primary warehouse.
    await InventoryTransaction.query().update({
      warehouseId: primaryWarehouse.id,
    });
    await InventoryCostLotTracker.query().update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
