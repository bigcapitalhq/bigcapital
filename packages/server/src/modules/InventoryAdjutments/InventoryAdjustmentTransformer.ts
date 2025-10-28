import { Transformer } from "../Transformer/Transformer";
import { InventoryAdjustment } from "./models/InventoryAdjustment";

export class InventoryAdjustmentTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedType'];
  };

  /**
   * Retrieves the formatted and localized adjustment type.
   * @param {IInventoryAdjustment} inventoryAdjustment
   * @returns {string}
   */
  formattedType(inventoryAdjustment: InventoryAdjustment) {
    const types = {
      increment: 'inventory_adjustment.increment',
      decrement: 'inventory_adjustment.decrement',
    };
    return this.context.i18n.t(types[inventoryAdjustment.type] || '');
  }
}
