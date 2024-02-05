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
import { TrialBalanceSheetRepository } from './TrialBalanceSheetRepository';

export default class TrialBalanceSheet extends FinancialSheet {
  /**
   * Trial balance sheet query.
   * @param {ITrialBalanceSheetQuery} query
   */
  private query: ITrialBalanceSheetQuery;

  /**
   * Trial balance sheet repository.
   * @param {TrialBalanceSheetRepository}
   */
  private repository: TrialBalanceSheetRepository;

  /**
   * Organization base currency.
   * @param {string}
   */
  private baseCurrency: string;

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
    repository: TrialBalanceSheetRepository,
    baseCurrency: string
  ) {
    super();

    this.tenantId = tenantId;
    this.query = query;
    this.repository = repository;
    this.numberFormat = this.query.numberFormat;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Retrieves the closing credit of the given account.
   * @param {number} accountId
   * @returns {number}
   */
  public getClosingAccountCredit(accountId: number) {
    const depsAccountsIds =
      this.repository.accountsDepGraph.dependenciesOf(accountId);

    return this.repository.totalAccountsLedger
      .whereAccountsIds([accountId, ...depsAccountsIds])
      .getClosingCredit();
  }

  /**
   * Retrieves the closing debit of the given account.
   * @param {number} accountId
   * @returns {number}
   */
  public getClosingAccountDebit(accountId: number) {
    const depsAccountsIds =
      this.repository.accountsDepGraph.dependenciesOf(accountId);

    return this.repository.totalAccountsLedger
      .whereAccountsIds([accountId, ...depsAccountsIds])
      .getClosingDebit();
  }

  /**
   * Retrieves the closing total of the given account.
   * @param {number} accountId
   * @returns {number}
   */
  public getClosingAccountTotal(accountId: number) {
    const credit = this.getClosingAccountCredit(accountId);
    const debit = this.getClosingAccountDebit(accountId);

    return debit - credit;
  }

  /**
   * Account mapper.
   * @param {IAccount} account
   * @return {ITrialBalanceAccount}
   */
  private accountTransformer = (
    account: IAccount & { type: IAccountType }
  ): ITrialBalanceAccount => {
    const debit = this.getClosingAccountDebit(account.id);
    const credit = this.getClosingAccountCredit(account.id);
    const balance = this.getClosingAccountTotal(account.id);

    return {
      id: account.id,
      parentAccountId: account.parentAccountId,
      name: account.name,
      formattedName: account.code
        ? `${account.name} - ${account.code}`
        : `${account.name}`,
      code: account.code,
      accountNormal: account.accountNormal,

      credit,
      debit,
      balance,
      currencyCode: this.baseCurrency,

      formattedCredit: this.formatNumber(credit),
      formattedDebit: this.formatNumber(debit),
      formattedBalance: this.formatNumber(balance),
    };
  };

  /**
   * Filters trial balance sheet accounts nodes based on the given report query.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private accountFilter = (accountNode: ITrialBalanceAccount): boolean => {
    const { noneTransactions, noneZero, onlyActive } = this.query;

    // Conditions pair filter detarminer.
    const condsPairFilters = [
      [noneTransactions, this.filterNoneTransactions],
      [noneZero, this.filterNoneZero],
      [onlyActive, this.filterActiveOnly],
    ];
    return allPassedConditionsPass(condsPairFilters)(accountNode);
  };

  /**
   * Fitlers the accounts nodes.
   * @param {ITrialBalanceAccount[]} accountsNodes
   * @returns {ITrialBalanceAccount[]}
   */
  private accountsFilter = (
    accountsNodes: ITrialBalanceAccount[]
  ): ITrialBalanceAccount[] => {
    return accountsNodes.filter(this.accountFilter);
  };

  /**
   * Mappes the given account object to trial balance account node.
   * @param {IAccount[]} accountsNodes
   * @returns {ITrialBalanceAccount[]}
   */
  private accountsMapper = (
    accountsNodes: IAccount[]
  ): ITrialBalanceAccount[] => {
    return accountsNodes.map(this.accountTransformer);
  };

  /**
   * Detarmines whether the given account node is not none transactions.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private filterNoneTransactions = (
    accountNode: ITrialBalanceAccount
  ): boolean => {
    return false === this.repository.totalAccountsLedger.isEmpty();
  };

  /**
   * Detarmines whether the given account none zero.
   * @param {ITrialBalanceAccount} accountNode
   * @returns {boolean}
   */
  private filterNoneZero = (accountNode: ITrialBalanceAccount): boolean => {
    return accountNode.balance !== 0;
  };

  /**
   * Detarmines whether the given account is active.
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
    // Retrieve accounts nodes.
    const accounts = this.accountsSection(this.repository.accounts);

    // Retrieve account node.
    const total = this.tatalSection(accounts);

    return { accounts, total };
  }
}
