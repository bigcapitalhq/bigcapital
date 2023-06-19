import { sumBy } from 'lodash';
import * as R from 'ramda';
import {
  ITrialBalanceSheetQuery,
  ITrialBalanceAccount,
  IAccount,
  ITrialBalanceTotal,
  ITrialBalanceSheetData,
  IAccountType,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { allPassedConditionsPass, flatToNestedArray } from 'utils';

export default class TrialBalanceSheet extends FinancialSheet {
  tenantId: number;
  query: ITrialBalanceSheetQuery;
  accounts: IAccount & { type: IAccountType }[];
  journalFinancial: any;
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @param {IAccount[]} accounts
   * @param journalFinancial
   */
  constructor(
    tenantId: number,
    query: ITrialBalanceSheetQuery,
    accounts: IAccount & { type: IAccountType }[],
    journalFinancial: any,
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.accounts = accounts;
    this.journalFinancial = journalFinancial;
    this.numberFormat = this.query.numberFormat;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Account mapper.
   * @param {IAccount} account
   * @return {ITrialBalanceAccount}
   */
  private accountTransformer = (
    account: IAccount & { type: IAccountType }
  ): ITrialBalanceAccount => {
    const trial = this.journalFinancial.getTrialBalanceWithDepends(account.id);

    return {
      id: account.id,
      parentAccountId: account.parentAccountId,
      name: account.name,
      code: account.code,
      accountNormal: account.accountNormal,

      credit: trial.credit,
      debit: trial.debit,
      balance: trial.balance,
      currencyCode: this.baseCurrency,

      formattedCredit: this.formatNumber(trial.credit),
      formattedDebit: this.formatNumber(trial.debit),
      formattedBalance: this.formatNumber(trial.balance),
    };
  };

  /**
   * Filters trial balance sheet accounts nodes based on the given report query.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private accountFilter = (accountNode: ITrialBalanceAccount): boolean => {
    const { noneTransactions, noneZero, onlyActive } = this.query;

    // Conditions pair filter determiner.
    const condsPairFilters = [
      [noneTransactions, this.filterNoneTransactions],
      [noneZero, this.filterNoneZero],
      [onlyActive, this.filterActiveOnly],
    ];
    return allPassedConditionsPass(condsPairFilters)(accountNode);
  };

  /**
   * Filters the accounts nodes.
   * @param {ITrialBalanceAccount[]} accountsNodes
   * @returns {ITrialBalanceAccount[]}
   */
  private accountsFilter = (
    accountsNodes: ITrialBalanceAccount[]
  ): ITrialBalanceAccount[] => {
    return accountsNodes.filter(this.accountFilter);
  };

  /**
   * Maps the given account object to trial balance account node.
   * @param {IAccount[]} accountsNodes
   * @returns {ITrialBalanceAccount[]}
   */
  private accountsMapper = (
    accountsNodes: IAccount[]
  ): ITrialBalanceAccount[] => {
    return accountsNodes.map(this.accountTransformer);
  };

  /**
   * Determines whether the given account node is not none transactions.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private filterNoneTransactions = (
    accountNode: ITrialBalanceAccount
  ): boolean => {
    const entries = this.journalFinancial.getAccountEntriesWithDepends(
      accountNode.id
    );
    return entries.length > 0;
  };

  /**
   * Determines whether the given account none zero.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private filterNoneZero = (accountNode: ITrialBalanceAccount): boolean => {
    return accountNode.balance !== 0;
  };

  /**
   * Determines whether the given account is active.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private filterActiveOnly = (accountNode: ITrialBalanceAccount): boolean => {
    return accountNode.credit !== 0 || accountNode.debit !== 0;
  };

  /**
   * Transformes the flatten nodes to nested nodes.
   * @param {ITrialBalanceAccount[]} flattenAccounts
   * @returns {ITrialBalanceAccount[]}
   */
  private nestedAccountsNode = (
    flattenAccounts: ITrialBalanceAccount[]
  ): ITrialBalanceAccount[] => {
    return flatToNestedArray(flattenAccounts, {
      id: 'id',
      parentId: 'parentAccountId',
    });
  };

  /**
   * Retrieve trial balance total section.
   * @param {ITrialBalanceAccount[]} accountsBalances
   * @return {ITrialBalanceTotal}
   */
  private tatalSection(
    accountsBalances: ITrialBalanceAccount[]
  ): ITrialBalanceTotal {
    const credit = sumBy(accountsBalances, 'credit');
    const debit = sumBy(accountsBalances, 'debit');
    const balance = sumBy(accountsBalances, 'balance');
    const currencyCode = this.baseCurrency;

    return {
      credit,
      debit,
      balance,
      currencyCode,
      formattedCredit: this.formatTotalNumber(credit),
      formattedDebit: this.formatTotalNumber(debit),
      formattedBalance: this.formatTotalNumber(balance),
    };
  }

  /**
   * Retrieve accounts section of trial balance report.
   * @param {IAccount[]} accounts
   * @returns {ITrialBalanceAccount[]}
   */
  private accountsSection(accounts: IAccount & { type: IAccountType }[]) {
    return R.compose(
      this.nestedAccountsNode,
      this.accountsFilter,
      this.accountsMapper
    )(accounts);
  }

  /**
   * Retrieve trial balance sheet statement data.
   * Note: Retruns null in case there is no transactions between the given date periods.
   *
   * @return {ITrialBalanceSheetData}
   */
  public reportData(): ITrialBalanceSheetData {
    // Don't return noting if the journal has no transactions.
    if (this.journalFinancial.isEmpty()) {
      return null;
    }
    // Retrieve accounts nodes.
    const accounts = this.accountsSection(this.accounts);

    // Retrieve account node.
    const total = this.tatalSection(accounts);

    return { accounts, total };
  }
}
