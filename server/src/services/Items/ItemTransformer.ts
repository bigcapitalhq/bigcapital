import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export default class ItemTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return ['sellPriceFormatted', 'costPriceFormatted'];
  };

  /**
   * Formatted sell price.
   * @param item
   * @returns {string}
   */
  public sellPriceFormatted(item): string {
    return formatNumber(item.sellPrice, {
      currencyCode: this.meta.baseCurrency,
    });
  }

  /**
   * Formatted cost price.
   * @param item
   * @returns {string}
   */
  public costPriceFormatted(item): string {
    return formatNumber(item.costPrice, {
      currencyCode: this.meta.baseCurrency,
    });
  }
}
