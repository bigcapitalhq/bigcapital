import { Service } from 'typedi';
import * as R from 'ramda';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import {
  IAccountTransactionsGroupBy,
  IBalanceSheetQuery,
  ILedger,
} from '@/interfaces';
import { transformToMapBy } from 'utils';
import Ledger from '@/services/Accounting/Ledger';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialDatePeriods } from '../FinancialDatePeriods';
import { BalanceSheetRepositoryNetIncome } from './BalanceSheetRepositoryNetIncome';

@Service()
export default class BalanceSheetRepository extends R.compose(
  BalanceSheetRepositoryNetIncome,
  FinancialDatePeriods
)(class {}) {
  /**
   *
   */
  private readonly models;

  /**
   * @param {number}
   */
  public readonly tenantId: number;

  /**
   * @param {BalanceSheetQuery}
   */
  public readonly query: BalanceSheetQuery;

  /**
   * @param {}
   */
  public accounts: any;

  /**
   * @param {}
   */
  public accountsGraph: any;

  /**
   *
   */
  public accountsByType: any;

  /**
   * PY from date.
   * @param {Date}
   */
  public readonly PYFromDate: Date;

  /**
   * PY to date.
   * @param {Date}
   */
  public readonly PYToDate: Date;

  /**
   * PP to date.
   * @param {Date}
   */
  public readonly PPToDate: Date;

  /**
   * PP from date.
   * @param {Date}
   */
  public readonly PPFromDate: Date;

  /**
   * Total closing accounts ledger.
   * @param {Ledger}
   */
  public totalAccountsLedger: Ledger;

  /**
   * Total income accounts ledger.
   */
  public incomeLedger: Ledger;

  /**
   * Total expense accounts ledger.
   */
  public expensesLedger: Ledger;

  /**
   * Transactions group type.
   * @param {IAccountTransactionsGroupBy}
   */
  public transactionsGroupType: IAccountTransactionsGroupBy =
    IAccountTransactionsGroupBy.Month;

  // -----------------------
  // # Date Periods
  // -----------------------
  /**
   * @param {Ledger}
   */
  public periodsAccountsLedger: Ledger;

  /**
   * @param {Ledger}
   */
  public periodsOpeningAccountLedger: Ledger;

  // -----------------------
  // # Previous Year (PY).
  // -----------------------
  /**
   * @param {Ledger}
   */
  public PYPeriodsOpeningAccountLedger: Ledger;

  /**
   * @param {Ledger}
   */
  public PYPeriodsAccountsLedger: Ledger;

  /**
   * @param {Ledger}
   */
  public PYTotalAccountsLedger: ILedger;

  // -----------------------
  // # Previous Period (PP).
  // -----------------------
  /**
   * @param {Ledger}
   */
  public PPTotalAccountsLedger: Ledger;

  /**
   * @param {Ledger}
   */
  public PPPeriodsAccountsLedger: ILedger;

  /**
   * @param {Ledger}
   */
  public PPPeriodsOpeningAccountLedger: ILedger;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   */
  constructor(models: any, query: IBalanceSheetQuery) {
    super();

    this.query = new BalanceSheetQuery(query);
    this.models = models;

    this.transactionsGroupType = this.getGroupByFromDisplayColumnsBy(
      this.query.displayColumnsBy
    );
  }

  /**
   * Async initialize.
   * @returns {Promise<void>}
   */
  public asyncInitialize = async () => {
    await this.initAccounts();
    await this.initAccountsGraph();

    await this.initAccountsTotalLedger();

    // Date periods.
    if (this.query.isDatePeriodsColumnsType()) {
      await this.initTotalDatePeriods();
    }
    // Previous Year (PY).
    if (this.query.isPreviousYearActive()) {
      await this.initTotalPreviousYear();
    }
    if (
      this.query.isPreviousYearActive() &&
      this.query.isDatePeriodsColumnsType()
    ) {
      await this.initPeriodsPreviousYear();
    }
    // Previous Period (PP).
    if (this.query.isPreviousPeriodActive()) {
      await this.initTotalPreviousPeriod();
    }
    if (
      this.query.isPreviousPeriodActive() &&
      this.query.isDatePeriodsColumnsType()
    ) {
      await this.initPeriodsPreviousPeriod();
    }
    //
    await this.asyncInitializeNetIncome();
  };

  // ----------------------------
  // # Accounts
  // ----------------------------
  public initAccounts = async () => {
    const accounts = await this.getAccounts();

    this.accounts = accounts;
    this.accountsByType = transformToMapBy(accounts, 'accountType');
    this.accountsByParentType = transformToMapBy(accounts, 'accountParentType');
  };

  /**
   * Initialize accounts graph.
   */
  public initAccountsGraph = async () => {
    const { Account } = this.models;

    this.accountsGraph = Account.toDependencyGraph(this.accounts);
  };

  // ----------------------------
  // # Closing Total
  // ----------------------------
  /**
   * Initialize accounts closing total based on the given query.
   * @returns {Promise<void>}
   */
  private initAccountsTotalLedger = async (): Promise<void> => {
    const totalByAccount = await this.closingAccountsTotal(this.query.toDate);

    // Inject to the repository.
    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccount);
  };

  // ----------------------------
  // # Date periods.
  // ----------------------------
  /**
   * Initialize date periods total.
   * @returns {Promise<void>}
   */
  public initTotalDatePeriods = async (): Promise<void> => {
    // Retrieves grouped transactions by given date group.
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.fromDate,
      this.query.toDate,
      this.transactionsGroupType
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.fromDate
    );
    // Inject to the repository.
    this.periodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
    this.periodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount
    );
  };

  // ----------------------------
  // # Previous Year (PY).
  // ----------------------------
  /**
   * Initialize total of previous year.
   * @returns {Promise<void>}
   */
  private initTotalPreviousYear = async (): Promise<void> => {
    const PYTotalsByAccounts = await this.closingAccountsTotal(
      this.query.PYToDate
    );
    // Inject to the repository.
    this.PYTotalAccountsLedger = Ledger.fromTransactions(PYTotalsByAccounts);
  };

  /**
   * Initialize date periods of previous year.
   * @returns {Promise<void>}
   */
  private initPeriodsPreviousYear = async (): Promise<void> => {
    const PYPeriodsBYAccounts = await this.accountsDatePeriods(
      this.query.PYFromDate,
      this.query.PYToDate,
      this.transactionsGroupType
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.PYFromDate
    );
    // Inject to the repository.
    this.PYPeriodsAccountsLedger = Ledger.fromTransactions(PYPeriodsBYAccounts);
    this.PYPeriodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount
    );
  };

  // ----------------------------
  // # Previous Year (PP).
  // ----------------------------
  /**
   * Initialize total of previous year.
   * @returns {Promise<void>}
   */
  private initTotalPreviousPeriod = async (): Promise<void> => {
    const PPTotalsByAccounts = await this.closingAccountsTotal(
      this.query.PPToDate
    );
    // Inject to the repository.
    this.PPTotalAccountsLedger = Ledger.fromTransactions(PPTotalsByAccounts);
  };

  /**
   * Initialize date periods of previous year.
   * @returns {Promise<void>}
   */
  private initPeriodsPreviousPeriod = async (): Promise<void> => {
    const PPPeriodsBYAccounts = await this.accountsDatePeriods(
      this.query.PPFromDate,
      this.query.PPToDate,
      this.transactionsGroupType
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.PPFromDate
    );
    // Inject to the repository.
    this.PPPeriodsAccountsLedger = Ledger.fromTransactions(PPPeriodsBYAccounts);
    this.PPPeriodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount
    );
  };

  // ----------------------------
  // # Utils
  // ----------------------------
  /**
   * Retrieve accounts of the report.
   * @return {Promise<IAccount[]>}
   */
  private getAccounts = () => {
    const { Account } = this.models;

    return Account.query();
  };

  /**
   * Closing accounts date periods.
   * @param {Date} fromDate
   * @param {Date} toDate
   * @param {string} datePeriodsType
   * @returns
   */
  public accountsDatePeriods = async (
    fromDate: Date,
    toDate: Date,
    datePeriodsType: string
  ) => {
    const { AccountTransaction } = this.models;

    return AccountTransaction.query().onBuild((query) => {
      query.sum('credit as credit');
      query.sum('debit as debit');
      query.groupBy('accountId');
      query.select(['accountId']);

      query.modify('groupByDateFormat', datePeriodsType);
      query.modify('filterDateRange', fromDate, toDate);
      query.withGraphFetched('account');

      this.commonFilterBranchesQuery(query);
    });
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
