import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class EstimatesActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateEstimatesWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { SaleEstimate, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the sale estimates with primary warehouse.
    await SaleEstimate.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale estimates entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'SaleEstimate').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
