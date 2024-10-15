import { IAccount, IAccountsStructureType } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import {
  assocDepthLevelToObjectTree,
  flatToNestedArray,
  formatNumber,
  nestedArrayToFlatten,
} from 'utils';

export class AccountTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'accountTypeLabel',
      'accountNormalFormatted',
      'formattedAmount',
      'flattenName',
      'bankBalanceFormatted',
      'lastFeedsUpdatedAtFormatted',
      'isFeedsPaused',
    ];
  };

  /**
   * Exclude attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['plaidItem'];
  };

  /**
   * Retrieves the flatten name with all dependants accounts names.
   * @param {IAccount} account -
   * @returns {string}
   */
  public flattenName = (account: IAccount): string => {
    const parentDependantsIds = this.options.accountsGraph.dependantsOf(
      account.id
    );
    const prefixAccounts = parentDependantsIds.map((dependId) => {
      const node = this.options.accountsGraph.getNodeData(dependId);
      return `${node.name}: `;
    });
    return `${prefixAccounts}${account.name}`;
  };

  /**
   * Retrieve formatted account amount.
   * @param {IAccount} invoice
   * @returns {string}
   */
  protected formattedAmount = (account: IAccount): string => {
    return formatNumber(account.amount, { currencyCode: account.currencyCode });
  };

  /**
   * Retrieves the formatted bank balance.
   * @param {IAccount} account
   * @returns {string}
   */
  protected bankBalanceFormatted = (account: IAccount): string => {
    return formatNumber(account.bankBalance, {
      currencyCode: account.currencyCode,
    });
  };

  /**
   * Retrieves the formatted last feeds update at.
   * @param {IAccount} account
   * @returns {string}
   */
  protected lastFeedsUpdatedAtFormatted = (account: IAccount): string => {
    return this.formatDate(account.lastFeedsUpdatedAt);
  };

  /**
   * Detarmines whether the bank account connection is paused.
   * @param account
   * @returns {boolean}
   */
  protected isFeedsPaused = (account: any): boolean => {
    return account.plaidItem?.isPaused || false;
  };

  /**
   * Retrieves formatted account type label.
   * @returns {string}
   */
  protected accountTypeLabel = (account: any): string => {
    return this.context.i18n.__(account.accountTypeLabel);
  };

  /**
   * Retrieves formatted account normal.
   * @returns {string}
   */
  protected accountNormalFormatted = (account: any): string => {
    return this.context.i18n.__(account.accountNormalFormatted);
  };

  /**
   * Transformes the accounts collection to flat or nested array.
   * @param {IAccount[]}
   * @returns {IAccount[]}
   */
  protected postCollectionTransform = (accounts: IAccount[]) => {
    // Transfom the flatten to accounts tree.
    const transformed = flatToNestedArray(accounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
    // Associate `accountLevel` attr to indicate object depth.
    const transformed2 = assocDepthLevelToObjectTree(
      transformed,
      1,
      'accountLevel'
    );
    return this.options.structure === IAccountsStructureType.Flat
      ? nestedArrayToFlatten(transformed2)
      : transformed2;
  };
}
