import { TransformerInjectable } from "@/modules/Transformer/TransformerInjectable.service";
import { InventoryAdjustment } from "../models/InventoryAdjustment";
import { InventoryAdjustmentTransformer } from "../InventoryAdjustmentTransformer";

export class GetInventoryAdjustmentService {
  constructor(
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieve specific inventory adjustment transaction details.
   * @param {number} inventoryAdjustmentId - Inventory adjustment id.
   */
  async getInventoryAdjustment(
    inventoryAdjustmentId: number,
  ) {
    // Retrieve inventory adjustment transation with associated models.
    const inventoryAdjustment = await InventoryAdjustment.query()
      .findById(inventoryAdjustmentId)
      .withGraphFetched('entries.item')
      .withGraphFetched('adjustmentAccount');

    // Throw not found if the given adjustment transaction not exists.
    this.throwIfAdjustmentNotFound(inventoryAdjustment);

    return this.transformer.transform(
      inventoryAdjustment,
      new InventoryAdjustmentTransformer(),
    );
  }
}
