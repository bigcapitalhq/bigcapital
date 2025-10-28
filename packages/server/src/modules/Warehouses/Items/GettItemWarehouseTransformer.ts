import { Transformer } from '@/modules/Transformer/Transformer';
import { Item } from '@/modules/Items/models/Item';

export class GetItemWarehouseTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'warehouseId',
      'warehouseName',
      'warehouseCode',
      'quantityOnHandFormatted',
    ];
  };

  /**
   * Exclude the warehouse attribute.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['warehouse'];
  };

  /**
   * Formatted sell price.
   * @param item
   * @returns {string}
   */
  public quantityOnHandFormatted(item: Item): string {
    return this.formatNumber(item.quantityOnHand, { money: false });
  }

  public warehouseCode(item: Item): string {
    return item.warehouse.code;
  }

  public warehouseName(item: Item): string {
    return item.warehouse.name;
  }

  public warehouseId(item: Item): number {
    return item.warehouse.id;
  }
}
