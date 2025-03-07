import { Inject, Injectable } from '@nestjs/common';
import { Warehouse } from '../models/Warehouse.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Bill } from '@/modules/Bills/models/Bill';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';

@Injectable()
export class BillActivateWarehouses {
  constructor(
    @Inject(Bill.name)
    private readonly billModel: TenantModelProxy<typeof Bill>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Updates all credit note transactions with the primary warehouse.
   * @param {Warehouse} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateBillsWithWarehouse = async (
    primaryWarehouse: Warehouse,
  ): Promise<void> => {
    // Updates the sale estimates with primary warehouse.
    await this.billModel().query().update({
      warehouseId: primaryWarehouse.id,
    });
    // Update the sale estimates entries with primary warehouse.
    await this.itemEntryModel().query().where('referenceType', 'Bill').update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
