import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { Inject, Injectable } from '@nestjs/common';
import { Warehouse } from '../models/Warehouse.model';

@Injectable()
export class CreditNotesActivateWarehouses {
  constructor(
    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Updates all credit note transactions with the primary warehouse.
   * @param   {Warehouse} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateCreditsWithWarehouse = async (
    primaryWarehouse: Warehouse
  ): Promise<void> => {
    // Updates the sale estimates with primary warehouse.
    await this.creditNoteModel().query().update({
      warehouseId: primaryWarehouse.id,
    });
    // Update the sale estimates entries with primary warehouse.
    await this.itemEntryModel()
      .query()
      .where('referenceType', 'CreditNote')
      .update({
        warehouseId: primaryWarehouse.id,
      });
  };
}
