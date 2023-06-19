import { ACCOUNT_NORMAL, ACCOUNT_ROOT_TYPE } from '@/data/AccountTypes';
import { IAccount, ProjectProfitabilitySummaryQuery } from '@/interfaces';
import { isEmpty, map } from 'lodash';
import Project from 'models/Project';
import Ledger from '@/services/Accounting/Ledger';

export class ProjectProfitabilitySummaryRepository {
  /**
   * Tenant models.
   */
  private readonly models;

  /**
   * The report query.
   * @param {ProjectProfitabilitySummaryQuery}
   */
  private readonly query: ProjectProfitabilitySummaryQuery;

  /**
   *
   * @param {Project[]}
   */
  public projects: Project[];

  /**
   * Income ledger grouped by projects.
   * @param {Ledger}
   */
  public incomeLedger: Ledger;

  /**
   * Expenses ledger grouped by projects.
   * @param {Ledger}
   */
  public expenseLedger: Ledger;

  /**
   *
   * @param {Models} models -
   * @param {ProjectProfitabilitySummaryQuery} query -
   */
  constructor(models: any, query: ProjectProfitabilitySummaryQuery) {
    this.query = query;
    this.models = models;
  }

  /**
   * Async initialize all DB queries.
   */
  public asyncInitialize = async () => {
    await this.initProjects();

    const incomeEntries = await this.getIncomeAccountsGroupedEntries();
    const expenseEntries = await this.getExpenseAccountsGroupedEntries();

    this.incomeLedger = Ledger.fromTransactions(incomeEntries);
    this.expenseLedger = Ledger.fromTransactions(expenseEntries);
  };

  /**
   * Initialize projects.
   */
  public initProjects = async () => {
    const { Project } = this.models;

    const projects = await Project.query().onBuild((query) => {
      if (this.query.projectsIds) {
        query.whereIn('id', this.query.projectsIds);
      }
      query.withGraphFetched('contact');
    });
    this.projects = projects;
  };

  /**
   * Retrieves the sumation of grouped entries by account and project id.
   * @param {number[]} accountsIds
   * @param {string} accountNormal -
   * @returns {}
   */
  public getAccountsGroupedEntries = async (accountsIds: number[]) => {
    const { AccountTransaction } = this.models;

    return AccountTransaction.query().onBuild((query) => {
      query.sum('credit as credit');
      query.sum('debit as debit');
      query.select(['accountId', 'projectId']);

      query.groupBy('accountId');
      query.groupBy('projectId');

      query.whereNotNull('projectId');
      query.withGraphFetched('account');

      query.whereIn('accountId', accountsIds);

      if (!isEmpty(this.query.projectsIds)) {
        query.modify('filterByProjects', this.query.projectsIds);
      }
    });
  };

  /**
   * Retrieves all income accounts.
   * @returns {IAccount}
   */
  public getIncomeAccounts = () => {
    const { Account } = this.models;

    return Account.query().modify('filterByRootType', ACCOUNT_ROOT_TYPE.INCOME);
  };

  /**
   * Retrieves all expenses accounts.
   * @returns
   */
  public getExpensesAccounts = () => {
    const { Account } = this.models;

    return Account.query().modify(
      'filterByRootType',
      ACCOUNT_ROOT_TYPE.EXPENSE
    );
  };

  /**
   * Retrieves the sumation of grouped entries by income accounts and projects.
   * @returns {}
   */
  public getIncomeAccountsGroupedEntries = async () => {
    const incomeAccounts = await this.getIncomeAccounts();
    const incomeAccountsIds = map(incomeAccounts, 'id');

    return this.getAccountsGroupedEntries(incomeAccountsIds);
  };

  /**
   * Retrieves the sumation of grouped entries by expenses accounts and projects.
   * @returns {}
   */
  public getExpenseAccountsGroupedEntries = async () => {
    const expenseAccounts = await this.getExpensesAccounts();
    const expenseAccountsIds = map(expenseAccounts, 'id');

    return this.getAccountsGroupedEntries(expenseAccountsIds);
  };
}
