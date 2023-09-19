import { Transformer } from '@/lib/Transformer/Transformer';

export class TaxRateTransformer extends Transformer {
  /**
   * Include these attributes to tax rate object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['nameFormatted', 'rateFormatted'];
  };

  /**
   * Retrieve the formatted rate.
   * @param taxRate
   * @returns {string}
   */
  public rateFormatted = (taxRate): string => {
    return `${taxRate.rate}%`;
  };

  /**
   * Formats the tax rate name.
   * @param taxRate
   * @returns {string}
   */
  protected nameFormatted = (taxRate): string => {
    return `${taxRate.name} [${taxRate.rate}%]`;
  };
}
