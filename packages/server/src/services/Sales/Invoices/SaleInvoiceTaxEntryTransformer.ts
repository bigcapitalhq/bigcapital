import { Transformer } from '@/lib/Transformer/Transformer';

export class SaleInvoiceTaxEntryTransformer extends Transformer {
  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['name', 'taxRateCode', 'raxRate', 'taxRateId'];
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
  protected raxRate = (taxEntry) => {
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
}
