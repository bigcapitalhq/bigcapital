// @ts-nocheck
import { Inject, Injectable, Scope } from '@nestjs/common';
import * as R from 'ramda';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import {
  IAccountTransactionsGroupBy,
  IBalanceSheetQuery,
} from './BalanceSheet.types';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { BalanceSheetRepositoryNetIncome } from './BalanceSheetRepositoryNetIncome';
import { ILedger } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class BalanceSheetRepository extends R.compose(
  BalanceSheetRepositoryNetIncome,
  FinancialDatePeriods,
)(class {}) {
  /**
   * Account model.
   */
  @Inject(Account.name)
  public readonly accountModel: TenantModelProxy<typeof Account>;

  /**
   * Account transaction model.
   */
  @Inject(AccountTransaction.name)
  public readonly accountTransactionModel: TenantModelProxy<
    typeof AccountTransaction
  >;

  /**
   * @description Balance sheet query.
   * @param {BalanceSheetQuery}
   */
  public query: BalanceSheetQuery;

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
   * @param {IBalanceSheetQuery} query
   */
  public setQuery(query: IBalanceSheetQuery) {
    this.query = new BalanceSheetQuery(query);

    this.transactionsGroupType = this.getGroupByFromDisplayColumnsBy(
      this.query.displayColumnsBy,
    );
  }

  /**
   * Async initialize.
   * @returns {Promise<void>}
   */
  public asyncInitialize = async (query: IBalanceSheetQuery) => {
    this.setQuery(query);

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
    this.accountsGraph = this.accountModel().toDependencyGraph(this.accounts);
  };

  // ----------------------------
  // # Closing Total
  // ----------------------------
  /**
   * Initialize accounts closing total based on the given query.
   * @returns {Promise<void>}
   */
  public initAccountsTotalLedger = async (): Promise<void> => {
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
      this.transactionsGroupType,
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.fromDate,
    );
    // Inject to the repository.
    this.periodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
    this.periodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount,
    );
  };

  // ----------------------------
  // # Previous Year (PY).
  // ----------------------------
  /**
   * Initialize total of previous year.
   * @returns {Promise<void>}
   */
  public initTotalPreviousYear = async (): Promise<void> => {
    const PYTotalsByAccounts = await this.closingAccountsTotal(
      this.query.PYToDate,
    );
    // Inject to the repository.
    this.PYTotalAccountsLedger = Ledger.fromTransactions(PYTotalsByAccounts);
  };

  /**
   * Initialize date periods of previous year.
   * @returns {Promise<void>}
   */
  public initPeriodsPreviousYear = async (): Promise<void> => {
    const PYPeriodsBYAccounts = await this.accountsDatePeriods(
      this.query.PYFromDate,
      this.query.PYToDate,
      this.transactionsGroupType,
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.PYFromDate,
    );
    // Inject to the repository.
    this.PYPeriodsAccountsLedger = Ledger.fromTransactions(PYPeriodsBYAccounts);
    this.PYPeriodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount,
    );
  };

  // ----------------------------
  // # Previous Year (PP).
  // ----------------------------
  /**
   * Initialize total of previous year.
   * @returns {Promise<void>}
   */
  public initTotalPreviousPeriod = async (): Promise<void> => {
    const PPTotalsByAccounts = await this.closingAccountsTotal(
      this.query.PPToDate,
    );
    // Inject to the repository.
    this.PPTotalAccountsLedger = Ledger.fromTransactions(PPTotalsByAccounts);
  };

  /**
   * Initialize date periods of previous year.
   * @returns {Promise<void>}
   */
  public initPeriodsPreviousPeriod = async (): Promise<void> => {
    const PPPeriodsBYAccounts = await this.accountsDatePeriods(
      this.query.PPFromDate,
      this.query.PPToDate,
      this.transactionsGroupType,
    );
    // Retrieves opening balance of grouped transactions.
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.PPFromDate,
    );
    // Inject to the repository.
    this.PPPeriodsAccountsLedger = Ledger.fromTransactions(PPPeriodsBYAccounts);
    this.PPPeriodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount,
    );
  };

  // ----------------------------
  // # Utils
  // ----------------------------
  /**
   * Retrieve accounts of the report.
   * @return {Promise<IAccount[]>}
   */
  public getAccounts = () => {
    return this.accountModel().query();
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
    datePeriodsType: string,
  ) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query) => {
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
    return this.accountTransactionModel()
      .query()
      .onBuild((query) => {
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
  public commonFilterBranchesQuery = (query: Knex.QueryBuilder) => {
    if (!isEmpty(this.query.branchesIds)) {
      query.modify('filterByBranches', this.query.branchesIds);
    }
  };
}
