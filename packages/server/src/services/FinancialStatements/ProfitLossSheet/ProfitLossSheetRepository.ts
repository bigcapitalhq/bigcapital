import { castArray, defaultTo } from 'lodash';
import * as R from 'ramda';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';

import { transformToMapBy } from 'utils';
import {
  IProfitLossSheetQuery,
  IAccount,
  IAccountTransactionsGroupBy,
} from '@/interfaces';
import Ledger from '@/services/Accounting/Ledger';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { FinancialDatePeriods } from '../FinancialDatePeriods';

export class ProfitLossSheetRepository extends R.compose(FinancialDatePeriods)(
  class {}
) {
  /**
   *
   */
  public models: any;

  /**
   *
   */
  public accountsByType: any;

  /**
   * @param {}
   */
  public accounts: IAccount[];

  /**
   *
   */
  public accountsGraph: any;

  /**
   * Transactions group type.
   * @param {IAccountTransactionsGroupBy}
   */
  public transactionsGroupType: IAccountTransactionsGroupBy =
    IAccountTransactionsGroupBy.Month;

  /**
   * @param {IProfitLossSheetQuery}
   */
  public query: ProfitLossSheetQuery;

  /**
   * Previous year to date.
   * @param {Date}
   */
  public PYToDate: Date;

  /**
   * Previous year from date.
   * @param {Date}
   */
  public PYFromDate: Date;

  /**
   * Previous year to date.
   * @param {Date}
   */
  public PPToDate: Date;

  /**
   * Previous year from date.
   * @param {Date}
   */
  public PPFromDate: Date;

  // ------------------------
  // # Total
  // ------------------------
  /**
   * Accounts total.
   * @param {Ledger}
   */
  public totalAccountsLedger: Ledger;

  // ------------------------
  // # Date Periods.
  // ------------------------
  /**
   * Accounts date periods.
   * @param {Ledger}
   */
  public periodsAccountsLedger: Ledger;

  // ------------------------
  // # Previous Year (PY)
  // ------------------------
  /**
   * @param {Ledger}
   */
  public PYTotalAccountsLedger: Ledger;

  /**
   *
   * @param {Ledger}
   */
  public PYPeriodsAccountsLedger: Ledger;

  // ------------------------
  // # Previous Period (PP).
  // ------------------------
  /**
   * PP Accounts Periods.
   * @param {Ledger}
   */
  public PPPeriodsAccountsLedger: Ledger;

  /**
   * PP Accounts Total.
   * @param {Ledger}
   */
  public PPTotalAccountsLedger: Ledger;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {IBalanceSheetQuery} query
   */
  constructor(models: any, query: IProfitLossSheetQuery) {
    super();

    this.models = models;
    this.query = new ProfitLossSheetQuery(query);

    this.transactionsGroupType = this.getGroupByFromDisplayColumnsBy(
      this.query.displayColumnsBy
    );
  }

  /**
   * Async report repository.
   */
  public asyncInitialize = async () => {
    await this.initAccounts();
    await this.initAccountsGraph();

    await this.initAccountsTotalLedger();

    // Date Periods.
    if (this.query.isDatePeriodsColumnsType()) {
      await this.initTotalDatePeriods();
    }
    // Previous Period (PP)
    if (this.query.isPreviousPeriodActive()) {
      await this.initTotalPreviousPeriod();
    }
    if (
      this.query.isPreviousPeriodActive() &&
      this.query.isDatePeriodsColumnsType()
    ) {
      await this.initPeriodsPreviousPeriod();
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
  };

  // ----------------------------
  // # Accounts
  // ----------------------------
  /**
   * Initialize accounts of the report.
   */
  private initAccounts = async () => {
    const accounts = await this.getAccounts();

    // Inject to the repository.
    this.accounts = accounts;
    this.accountsByType = transformToMapBy(accounts, 'accountType');
  };

  /**
   * Initialize accounts graph.
   */
  private initAccountsGraph = async () => {
    const { Account } = this.models;

    this.accountsGraph = Account.toDependencyGraph(this.accounts);
  };

  // ----------------------------
  // # Closing Total.
  // ----------------------------
  /**
   * Initialize accounts closing total based on the given query.
   */
  private initAccountsTotalLedger = async (): Promise<void> => {
    const totalByAccount = await this.accountsTotal(
      this.query.fromDate,
      this.query.toDate
    );
    // Inject to the repository.
    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccount);
  };

  // ----------------------------
  // # Date periods.
  // ----------------------------
  /**
   * Initialize date periods total of accounts based on the given query.
   */
  private initTotalDatePeriods = async (): Promise<void> => {
    // Retrieves grouped transactions by given date group.
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.fromDate,
      this.query.toDate,
      this.transactionsGroupType
    );

    // Inject to the repository.
    this.periodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
  };

  // ----------------------------
  // # Previous Period (PP).
  // ----------------------------
  /**
   * Initialize total of previous period (PP).
   */
  private initTotalPreviousPeriod = async (): Promise<void> => {
    const PPTotalsByAccounts = await this.accountsTotal(
      this.query.PPFromDate,
      this.query.PPToDate
    );
    // Inject to the repository.
    this.PPTotalAccountsLedger = Ledger.fromTransactions(PPTotalsByAccounts);
  };

  /**
   * Initialize date periods of previous period (PP).
   */
  private initPeriodsPreviousPeriod = async (): Promise<void> => {
    // Retrieves grouped transactions by given date group.
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.PPFromDate,
      this.query.PPToDate,
      this.transactionsGroupType
    );
    // Inject to the repository.
    this.PPPeriodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
  };

  // ----------------------------
  // # Previous Year (PY).
  // ----------------------------
  /**
   * Initialize total of previous year (PY).
   */
  private initTotalPreviousYear = async (): Promise<void> => {
    const PYTotalsByAccounts = await this.accountsTotal(
      this.query.PYFromDate,
      this.query.PYToDate
    );
    // Inject to the repository.
    this.PYTotalAccountsLedger = Ledger.fromTransactions(PYTotalsByAccounts);
  };

  /**
   * Initialize periods of previous year (PY).
   */
  private initPeriodsPreviousYear = async () => {
    // Retrieves grouped transactions by given date group.
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.PYFromDate,
      this.query.PYToDate,
      this.transactionsGroupType
    );
    // Inject to the repository.
    this.PYPeriodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
  };

  // ----------------------------
  // # Utils
  // ----------------------------
  /**
   * Retrieve the opening balance transactions of the report.
   */
  public accountsTotal = async (fromDate: Date, toDate: Date) => {
    const { AccountTransaction } = this.models;

    return AccountTransaction.query().onBuild((query) => {
      query.sum('credit as credit');
      query.sum('debit as debit');
      query.groupBy('accountId');
      query.select(['accountId']);

      query.modify('filterDateRange', fromDate, toDate);
      query.withGraphFetched('account');

      this.commonFilterBranchesQuery(query);
    });
  };

  /**
   * Closing accounts date periods.
   * @param openingDate
   * @param datePeriodsType
   * @returns
   */
  public accountsDatePeriods = async (
    fromDate: Date,
    toDate: Date,
    datePeriodsType
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
   * Common branches filter query.
   * @param {Knex.QueryBuilder} query
   */
  private commonFilterBranchesQuery = (query: Knex.QueryBuilder) => {
    if (!isEmpty(this.query.branchesIds)) {
      query.modify('filterByBranches', this.query.branchesIds);
    }
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
   * 
   * @param type 
   * @returns 
   */
  public getAccountsByType = (type: string[] | string) => {
    return R.compose(
      R.flatten,
      R.map((accountType) =>
        R.defaultTo([], this.accountsByType.get(accountType))
      ),
      castArray
    )(type);
  };
}
