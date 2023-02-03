import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class VendorCreditActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all vendor credits transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateCreditsWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { VendorCredit, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the vendor credits transactions with primary warehouse.
    await VendorCredit.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale invoices entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'VendorCredit').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
