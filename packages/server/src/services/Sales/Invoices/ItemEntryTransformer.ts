import { IItemEntry } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class ItemEntryTransformer extends Transformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['quantityFormatted', 'rateFormatted', 'totalFormatted'];
  };

  /**
   * Retrieves the formatted quantitty of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected quantityFormatted = (entry: IItemEntry): string => {
    return formatNumber(entry.quantity, { money: false });
  };

  /**
   * Retrieves the formatted rate of item entry.
   * @param {IItemEntry} itemEntry -
   * @returns {string}
   */
  protected rateFormatted = (entry: IItemEntry): string => {
    return formatNumber(entry.rate, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  };

  /**
   * Retrieves the formatted total of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected totalFormatted = (entry: IItemEntry): string => {
    const discountedTotal = entry.total - ((entry.total * entry.discount) / 100);
    return formatNumber(discountedTotal, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  };
}
