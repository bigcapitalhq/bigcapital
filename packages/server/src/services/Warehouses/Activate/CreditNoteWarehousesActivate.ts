import { Service, Inject } from 'typedi';
import { IWarehouse } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class CreditNotesActivateWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all credit note transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateCreditsWithWarehouse = async (
    tenantId: number,
    primaryWarehouse: IWarehouse
  ): Promise<void> => {
    const { CreditNote, ItemEntry } = this.tenancy.models(tenantId);

    // Updates the sale estimates with primary warehouse.
    await CreditNote.query().update({ warehouseId: primaryWarehouse.id });

    // Update the sale estimates entries with primary warehouse.
    await ItemEntry.query().where('referenceType', 'CreditNote').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
