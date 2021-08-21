import { Service } from 'typedi';
import { IAccount } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

@Service()
export default class AccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return [
      'formattedAmount',
    ];
  };

  /**
   * Retrieve formatted account amount.
   * @param {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: IAccount): string => {
    return formatNumber(account.amount, {
      currencyCode: account.currencyCode,
    });
  };
}
