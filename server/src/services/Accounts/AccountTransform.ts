import { Service } from 'typedi';
import { IAccount } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export default class AccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'currencyCode'
    ];
  };

  /**
   * Retrieve formatted account amount.
   * @param {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: IAccount): string => {
    return formatNumber(account.amount, {
      currencyCode: this.meta.baseCurrency,
    });
  };

  /**
   * Retrieve account currency code.
   * @returns {string}
   */
   protected currencyCode = (): string => {
    return this.meta.baseCurrency;
  };
}
