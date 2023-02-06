import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ReceiptActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all sale receipts transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateReceiptsWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { SaleReceipt, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the vendor credits transactions with primary warehouse.
    await SaleReceipt.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale invoices entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'SaleReceipt').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
