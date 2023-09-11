import { Transformer } from '@/lib/Transformer/Transformer';

export class TaxRateTransformer extends Transformer {
  /**
   * Include these attributes to tax rate object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['nameFormatted'];
  };

  /**
   * Formats the tax rate name.
   * @param taxRate
   * @returns {string}
   */
  protected nameFormatted = (taxRate): string => {
    return `${taxRate.name} (${taxRate.rate}%)`;
  };
}
