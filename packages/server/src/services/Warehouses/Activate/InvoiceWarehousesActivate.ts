import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class InvoicesActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateInvoicesWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { SaleInvoice, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the sale invoices with primary warehouse.
    await SaleInvoice.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale invoices entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'SaleInvoice').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
