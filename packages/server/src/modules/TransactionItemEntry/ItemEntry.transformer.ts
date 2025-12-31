import { Transformer } from '../Transformer/Transformer';
import { ItemEntry } from './models/ItemEntry';

interface ItemEntryTransformerContext{
  currencyCode: string;
}

export class ItemEntryTransformer extends Transformer<{}, ItemEntryTransformerContext> {
  /**
   * Include these attributes to item entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'quantityFormatted',
      'rateFormatted',
      'totalFormatted',
      'taxRateIds',
      'taxes',
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

  /**
   * Retrieves the tax rate IDs from the taxes relation.
   * This is used by the frontend to populate the tax selector when editing.
   * @param {ItemEntry} entry
   * @returns {number[]}
   */
  protected taxRateIds = (entry: ItemEntry): number[] => {
    if (entry.taxes && entry.taxes.length > 0) {
      return entry.taxes.map((tax) => tax.taxRateId);
    }
    return [];
  };

  /**
   * Retrieves the taxes associated with this entry.
   * @param {ItemEntry} entry
   * @returns {Array}
   */
  protected taxes = (entry: ItemEntry) => {
    if (entry.taxes && entry.taxes.length > 0) {
      return entry.taxes.map((tax) => ({
        taxRateId: tax.taxRateId,
        taxRate: tax.taxRate,
        taxAmount: tax.taxAmount,
        taxableAmount: tax.taxableAmount,
        order: tax.order,
      }));
    }
    return [];
  };
}
