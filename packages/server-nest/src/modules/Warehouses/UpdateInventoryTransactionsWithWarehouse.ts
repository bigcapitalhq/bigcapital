import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { InventoryTransaction } from '../InventoryCost/models/InventoryTransaction';

@Injectable()
export class UpdateInventoryTransactionsWithWarehouse {
  constructor(
    @Inject(InventoryTransaction.name)
    private readonly inventoryTransactionModel: TenantModelProxy<
      typeof InventoryTransaction
    >,
  ) {}

  /**
   * Updates all inventory transactions with primary warehouse.
   * @param {number} warehouseId - Warehouse ID.
   */
  public run = async (primaryWarehouseId: number) => {
    await this.inventoryTransactionModel().query().update({
      warehouseId: primaryWarehouseId,
    });
  };
}
