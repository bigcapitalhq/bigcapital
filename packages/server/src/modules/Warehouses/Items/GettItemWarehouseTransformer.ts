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
      'availableForSale',
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

  /**
   * Quantity available for sale.
   * No allocation/commitment source exists in ItemWarehouseQuantity today,
   * so the full on-hand quantity is treated as available. Refine when an
   * allocation concept (sales orders, reservations) is introduced.
   */
  public availableForSale(item: Item): number {
    return item.quantityOnHand;
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
