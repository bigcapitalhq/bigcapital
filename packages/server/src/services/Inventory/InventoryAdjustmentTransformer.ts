import { IInventoryAdjustment } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';

export default class InventoryAdjustmentTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedType'];
  };

  /**
   * Retrieves the formatted and localized adjustment type.
   * @param   {IInventoryAdjustment} inventoryAdjustment
   * @returns {string}
   */
  formattedType(inventoryAdjustment: IInventoryAdjustment) {
    const types = {
      increment: 'inventory_adjustment.type.increment',
      decrement: 'inventory_adjustment.type.decrement',
    };
    return this.context.i18n.__(types[inventoryAdjustment.type] || '');
  }
}
