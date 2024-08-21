import { IAccount } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class CashflowAccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'lastFeedsUpdatedAt',
      'lastFeedsUpdatedAtFormatted',
      'lastFeedsUpdatedFromNow',
    ];
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
   * @param {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: IAccount): string => {
    return formatNumber(account.amount, {
      currencyCode: account.currencyCode,
    });
  };

  /**
   * Retrieves the last feeds update at formatted date.
   * @param {IAccount} account
   * @returns {string}
   */
  protected lastFeedsUpdatedAtFormatted(account: IAccount): string {
    return this.formatDate(account.lastFeedsUpdatedAt);
  }

  /**
   * Retrieves the last feeds updated from now.
   * @param {IAccount} account
   * @returns {string}
   */
  protected lastFeedsUpdatedFromNow(account: IAccount): string {
    return this.formatDateFromNow(account.lastFeedsUpdatedAt);
  }
}
