import { DiscountType, IItemEntry } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class ItemEntryTransformer extends Transformer {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'quantityFormatted',
      'rateFormatted',
      'totalFormatted',
      'discountFormatted',
      'discountAmountFormatted',
    ];
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
    return formatNumber(entry.total, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  };

  /**
   * Retrieves the formatted discount of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected discountFormatted = (entry: IItemEntry): string => {
    if (!entry.discount) {
      return '';
    }
    return entry.discountType === DiscountType.Percentage
      ? `${entry.discount}%`
      : formatNumber(entry.discount, {
          currencyCode: this.context.currencyCode,
          money: false,
        });
  };

  /**
   * Retrieves the formatted discount amount of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected discountAmountFormatted = (entry: IItemEntry): string => {
    return formatNumber(entry.discountAmount, {
      currencyCode: this.context.currencyCode,
      money: false,
      excerptZero: true,
    });
  };
}
