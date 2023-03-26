import { IAccount } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class CashflowAccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['formattedAmount'];
  };

  /**
   * Exclude these attributes to sale invoice object.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return [
      'predefined',
      'index',
      'accountRootType',
      'accountTypeLabel',
      'accountParentType',
      'isBalanceSheetAccount',
      'isPlSheet',
    ];
  };

  /**
   * Retrieve formatted account amount.
   * @param   {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: IAccount): string => {
    return formatNumber(account.amount, {
      currencyCode: account.currencyCode,
    });
  };
}
