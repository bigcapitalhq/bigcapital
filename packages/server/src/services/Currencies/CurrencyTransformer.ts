import { Transformer } from '@/lib/Transformer/Transformer';

export class CurrencyTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['isBaseCurrency'];
  };

  /**
   * Determines whether the currency is base currency.
   * @returns {boolean}
   */
  public isBaseCurrency(currency): boolean {
    return this.context.organization.baseCurrency === currency.currencyCode;
  }
}
