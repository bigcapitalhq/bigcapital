import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Service, Inject } from 'typedi';

@Service()
export class UpdateInventoryTransactionsWithWarehouse {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all inventory transactions with primary warehouse.
   * @param {number} tenantId -
   * @param {number} warehouseId -
   */
  public run = async (tenantId: number, primaryWarehouseId: number) => {
    const { InventoryTransaction } = this.tenancy.models(tenantId);

    await InventoryTransaction.query().update({
      warehouseId: primaryWarehouseId,
    });
  };
}
