
import { Transformer } from '@/modules/Transformer/Transformer';
import { getExlusiveTaxAmount, getInclusiveTaxAmount } from '../../TaxRates/utils';

export class SaleInvoiceTaxEntryTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'name',
      'taxRateCode',
      'taxRate',
      'taxRateId',
      'taxRateAmount',
      'taxRateAmountFormatted',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   *  Retrieve  tax rate code.
   * @param taxEntry
   * @returns {string}
   */
  protected taxRateCode = (taxEntry) => {
    return taxEntry.taxRate.code;
  };

  /**
   * Retrieve tax rate id.
   * @param taxEntry
   * @returns {number}
   */
  protected taxRate = (taxEntry) => {
    return taxEntry.taxAmount || taxEntry.taxRate.rate;
  };

  /**
   * Retrieve tax rate name.
   * @param taxEntry
   * @returns {string}
   */
  protected name = (taxEntry) => {
    return taxEntry.taxRate.name;
  };

  /**
   * Retrieve tax rate amount.
   * @param taxEntry
   */
  protected taxRateAmount = (taxEntry) => {
    const taxRate = this.taxRate(taxEntry);

    return this.options.isInclusiveTax
      ? getInclusiveTaxAmount(this.options.subtotal, taxRate)
      : getExlusiveTaxAmount(this.options.subtotal, taxRate);
  };

  /**
   * Retrieve formatted tax rate amount.
   * @returns {string}
   */
  protected taxRateAmountFormatted = (taxEntry) => {
    return this.formatNumber(this.taxRateAmount(taxEntry), {
      currencyCode: this.options.currencyCode,
    });
  };
}
