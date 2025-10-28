import { InventoryTransaction } from "@/modules/InventoryCost/models/InventoryTransaction";
import { TenantModelProxy } from "@/modules/System/models/TenantBaseModel";
import { Injectable } from "@nestjs/common";
import { Warehouse } from "../models/Warehouse.model";
import { InventoryCostLotTracker } from "@/modules/InventoryCost/models/InventoryCostLotTracker";

@Injectable()
export class InventoryActivateWarehouses {
  constructor(
    private readonly inventoryTransactionModel: TenantModelProxy<typeof InventoryTransaction>,
    private readonly inventoryCostLotTrackerModel: TenantModelProxy<typeof InventoryCostLotTracker>,
  ) {}

  /**
   * Updates all inventory transactions with the primary warehouse.
   * @param   {number} tenantId
   * @param   {number} primaryWarehouse
   * @returns {Promise<void>}
   */
  public updateInventoryTransactionsWithWarehouse = async (
    primaryWarehouse: Warehouse
  ): Promise<void> => {
    // Updates the inventory transactions with primary warehouse.
    await this.inventoryTransactionModel().query().update({
      warehouseId: primaryWarehouse.id,
    });
    await this.inventoryCostLotTrackerModel().query().update({
      warehouseId: primaryWarehouse.id,
    });
  };
}
