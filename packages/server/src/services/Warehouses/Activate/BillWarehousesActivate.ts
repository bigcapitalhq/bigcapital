import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class BillActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all credit note transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateBillsWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { Bill, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the sale estimates with primary warehouse.
    await Bill.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale estimates entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'Bill').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
