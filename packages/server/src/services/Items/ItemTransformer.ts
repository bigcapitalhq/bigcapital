import { Transformer } from '@/lib/Transformer/Transformer';
import { GetItemWarehouseTransformer } from '@/services/Warehouses/Items/GetItemWarehouseTransformer';
import { formatNumber } from 'utils';

export default class ItemTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'typeFormatted',
      'sellPriceFormatted',
      'costPriceFormatted',
      'itemWarehouses',
    ];
  };

  /**
   * Formatted item type.
   * @param {IItem} item
   * @returns {string}
   */
  public typeFormatted(item): string {
    return this.context.i18n.__(`item.field.type.${item.type}`);
  }

  /**
   * Formatted sell price.
   * @param item
   * @returns {string}
   */
  public sellPriceFormatted(item): string {
    return formatNumber(item.sellPrice, {
      currencyCode: this.context.organization.baseCurrency,
    });
  }

  /**
   * Formatted cost price.
   * @param item
   * @returns {string}
   */
  public costPriceFormatted(item): string {
    return formatNumber(item.costPrice, {
      currencyCode: this.context.organization.baseCurrency,
    });
  }

  /**
   * Associate the item warehouses quantity.
   * @param item
   * @returns
   */
  public itemWarehouses = (item) => {
    return this.item(
      item.itemWarehouses,
      new GetItemWarehouseTransformer(),
      {}
    );
  };
}
