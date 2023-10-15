import { Transformer } from "@/lib/Transformer/Transformer";
import { formatNumber } from 'utils';

export class SaleInvoiceEntryTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'amountFormatted',
      'rateFormatted',
    ];
  };

  /**
   * Retrieve formatted invoice date.
   * @param {ISaleInvoice} invoice
   * @returns {String}
   */
  protected amountFormatted = (entry): string => {
    return formatNumber(entry.amount, {
      currencyCode: this.options.currencyCode,
      money: false, 
      symbol: this.options.baseCurrencySymbol
    });
  }

  /**
   * Retrieve formatted due date.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected rateFormatted = (entry): string => {
    return formatNumber(entry.rate, {
      currencyCode: this.options.currencyCode,
      money: false, 
      symbol: this.options.baseCurrencySymbol
    });
  }
}