import { Transformer } from '../Transformer/Transformer';
import { ItemEntry } from './models/ItemEntry';

interface ItemEntryTransformerContext {
  currencyCode: string;
}

export class ItemEntryTransformer extends Transformer<
  {},
  ItemEntryTransformerContext
> {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'quantityFormatted',
      'rateFormatted',
      'discountFormatted',
      'totalFormatted',
    ];
  };

  /**
   * Retrieves the formatted quantitty of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected quantityFormatted = (entry: ItemEntry): string => {
    return this.formatNumber(entry.quantity, { money: false });
  };

  /**
   * Retrieves the formatted rate of item entry.
   * @param {IItemEntry} itemEntry -
   * @returns {string}
   */
  protected rateFormatted = (entry: ItemEntry): string => {
    return this.formatNumber(entry.rate, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  };

  /**
   * Retrieves the formatted discount amount of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected discountFormatted = (entry: ItemEntry): string => {
    return this.formatNumber(entry.discountAmount, {
      currencyCode: this.context.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Retrieves the formatted total of item entry.
   * @param {IItemEntry} entry
   * @returns {string}
   */
  protected totalFormatted = (entry: ItemEntry): string => {
    return this.formatNumber(entry.total, {
      currencyCode: this.context.currencyCode,
      money: false,
    });
  };
}
