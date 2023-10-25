import { ITrialBalanceSheetQuery } from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import { Service } from 'typedi';

@Service()
export class TrialBalanceSheetRepository {
  private query: ITrialBalanceSheetQuery;
  private models: any;
  public accounts: any;
  public accountsDepGraph;

  /**
   * Total closing accounts ledger.
   * @param {Ledger}
   */
  public totalAccountsLedger: Ledger;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   */
  constructor(models: any, repos: any, query: ITrialBalanceSheetQuery) {
    this.query = query;
    this.repos = repos;
    this.models = models;
  }

  /**
   * Async initialize.
   * @returns {Promise<void>}
   */
  public asyncInitialize = async () => {
    await this.initAccounts();
    await this.initAccountsClosingTotalLedger();
  };

  // ----------------------------
  // # Accounts
  // ----------------------------
  /**
   * Initialize accounts.
   * @returns {Promise<void>}
   */
  public initAccounts = async () => {
    const accounts = await this.getAccounts();
    const accountsDepGraph =
      await this.repos.accountRepository.getDependencyGraph();

    this.accountsDepGraph = accountsDepGraph;
    this.accounts = accounts;
  };

  /**
   * Initialize all accounts closing total ledger.
   * @return {Promise<void>}
   */
  public initAccountsClosingTotalLedger = async (): Promise<void> => {
    const totalByAccounts = await this.closingAccountsTotal(this.query.toDate);

    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccounts);
  };

  /**
   * Retrieve accounts of the report.
   * @return {Promise<IAccount[]>}
   */
  private getAccounts = () => {
    const { Account } = this.models;

    return Account.query();
  };

  /**
   * Retrieve the opening balance transactions of the report.
   * @param {Date|string} openingDate -
   */
  public closingAccountsTotal = async (openingDate: Date | string) => {
    const { AccountTransaction } = this.models;

    return AccountTransaction.query().onBuild((query) => {
      query.sum('credit as credit');
      query.sum('debit as debit');
      query.groupBy('accountId');
      query.select(['accountId']);

      query.modify('filterDateRange', null, openingDate);
      query.withGraphFetched('account');

      this.commonFilterBranchesQuery(query);
    });
  };

  /**
   * Common branches filter query.
   * @param {Knex.QueryBuilder} query
   */
  private commonFilterBranchesQuery = (query: Knex.QueryBuilder) => {
    if (!isEmpty(this.query.branchesIds)) {
      query.modify('filterByBranches', this.query.branchesIds);
    }
  };
}
