import { Account } from '../../Accounts/models/Account.model';
import { Transformer } from '../../Transformer/Transformer';
import { getReconciliationSupport } from '../../BankingReconciliation/getReconciliationSupport';

export class CashflowAccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'isReconciliationSupported',
      'lastFeedsUpdatedAt',
      'lastFeedsUpdatedAtFormatted',
      'lastFeedsUpdatedFromNow',
      'uncategorizedTransactionsCount',
      'plaidInstitutionName',
      'plaidInstitutionLogo',
    ];
  };

  protected isReconciliationSupported(account: Account): boolean {
    return getReconciliationSupport(
      account,
      this.context?.organization?.baseCurrency,
    ).isSupported;
  }

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
      // Never expose the Plaid item (it holds the access token).
      'plaidItem',
    ];
  };

  /**
   * Retrieve formatted account amount.
   * @param {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: Account): string => {
    return this.formatMoney(account.amount, {
      currencyCode: account.currencyCode,
    });
  };

  /**
   * Retrieves the last feeds update at formatted date.
   * @param {IAccount} account
   * @returns {string}
   */
  protected lastFeedsUpdatedAtFormatted(account: Account): string {
    return account.lastFeedsUpdatedAt
      ? this.formatDate(account.lastFeedsUpdatedAt)
      : '';
  }

  /**
   * Retrieves the last feeds updated from now.
   * @param {IAccount} account
   * @returns {string}
   */
  protected lastFeedsUpdatedFromNow(account: Account): string {
    return account.lastFeedsUpdatedAt
      ? this.formatDateFromNow(account.lastFeedsUpdatedAt)
      : '';
  }

  /**
   * Retrieves the Plaid institution name of the linked bank account.
   * @param {Account} account
   * @returns {string|null}
   */
  protected plaidInstitutionName = (account: Account): string | null => {
    return account.plaidItem?.plaidInstitutionName || null;
  };

  /**
   * Retrieves the Plaid institution logo of the linked bank account as a
   * ready-to-use image data URL.
   * @param {Account} account
   * @returns {string|null}
   */
  protected plaidInstitutionLogo = (account: Account): string | null => {
    const logo = account.plaidItem?.plaidInstitutionLogo;

    if (!logo) {
      return null;
    }
    return logo.startsWith('data:') ? logo : `data:image/png;base64,${logo}`;
  };

  /**
   * Retrieves the uncategorized transactions count of the account.
   * @param {IAccount} account
   * @returns {number}
   */
  protected uncategorizedTransactionsCount(account: Account): number {
    return account['uncategorizedTransactions'] || 0;
  }
}
