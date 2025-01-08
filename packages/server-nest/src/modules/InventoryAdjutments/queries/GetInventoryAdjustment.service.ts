import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { InventoryAdjustment } from '../models/InventoryAdjustment';
import { InventoryAdjustmentTransformer } from '../InventoryAdjustmentTransformer';
import { Inject } from '@nestjs/common';

export class GetInventoryAdjustmentService {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(InventoryAdjustment.name)
    private readonly inventoryAdjustmentModel: typeof InventoryAdjustment,
  ) {}

  /**
   * Retrieve specific inventory adjustment transaction details.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  async getInventoryAdjustment(inventoryAdjustmentId: number) {
    // Retrieve inventory adjustment transation with associated models.
    const inventoryAdjustment = await this.inventoryAdjustmentModel
      .query()
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries.item')
      .withGraphFetched('adjustmentAccount')
      .throwIfNotFound();

    return this.transformer.transform(
      inventoryAdjustment,
      new InventoryAdjustmentTransformer(),
    );
  }
}
