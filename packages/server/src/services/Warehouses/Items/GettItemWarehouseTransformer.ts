import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

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

  public excludeAttributes = (): string[] => {
    return ['warehouse'];
  };

  /**
   * Formatted sell price.
   * @param item
   * @returns {string}
   */
  public quantityOnHandFormatted(item): string {
    return formatNumber(item.quantityOnHand, { money: false });
  }

  public warehouseCode(item): string {
    return item.warehouse.code;
  }

  public warehouseName(item): string {
    return item.warehouse.name;
  }

  public warehouseId(item): number {
    return item.warehouse.id;
  }
}
