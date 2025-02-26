import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { SaleEstimate } from '@/modules/SaleEstimates/models/SaleEstimate';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Injectable } from '@nestjs/common';
import { Warehouse } from '../models/Warehouse.model';

@Injectable()
export class EstimatesActivateWarehouses {
  constructor(
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param {Warehouse} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateEstimatesWithWarehouse = async (
    primaryWarehouse: Warehouse,
  ): Promise<void> => {
    // Updates the sale estimates with primary warehouse.
    await this.saleEstimateModel()
      .query()
      .update({ warehouseId: primaryWarehouse.id });

    // Update the sale estimates entries with primary warehouse.
    await this.itemEntryModel()
      .query()
      .where('referenceType', 'SaleEstimate')
      .update({
        warehouseId: primaryWarehouse.id,
      });
  };
}
