// @ts-nocheck
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ModelObject } from 'objection';
import { castArray } from 'lodash';
import * as R from 'ramda';
import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { Ledger } from '@/modules/Ledger/Ledger';
import { IProfitLossSheetQuery } from './ProfitLossSheet.types';
import { IAccountTransactionsGroupBy } from '../BalanceSheet/BalanceSheet.types';
import { Account } from '@/modules/Accounts/models/Account.model';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable({ scope: Scope.TRANSIENT })
export class ProfitLossSheetRepository extends R.compose(FinancialDatePeriods)(
  class {},
) {
  @Inject(Account.name)
  public accountModel: TenantModelProxy<typeof Account>;

  @Inject(AccountTransaction.name)
  public accountTransactionModel: TenantModelProxy<typeof AccountTransaction>;

  @Inject(TenancyContext)
  public tenancyContext: TenancyContext;

  /**
   * Tenancy base currency.
   * @param {string}
   */
  public baseCurrency: string;

  /**
   * Accounts by type.
   */
  public accountsByType: any;

  /**
   * @param {ModelObject<Account>[]}
   */
  public accounts: ModelObject<Account>[];

  /**
   * Accounts graph.
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
   * Set the filter of the report.
   * @param {IBalanceSheetQuery} query
   */
  setFilter(query: IProfitLossSheetQuery) {
    this.query = new ProfitLossSheetQuery(query);

    this.transactionsGroupType = this.getGroupByFromDisplayColumnsBy(
      this.query.displayColumnsBy,
    );
  }

  /**
   * Async report repository.
   */
  public asyncInitialize = async () => {
    await this.initBaseCurrency();
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

  /**
   * Initialize the base currency.
   */
  async initBaseCurrency() {
    const metadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = metadata.baseCurrency;
  }

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
    this.accountsGraph = this.accountModel().toDependencyGraph(this.accounts);
  };

  // ----------------------------
  // # Closing Total.
  // ----------------------------
  /**
   * Initialize accounts closing total based on the given query.
   */
  private initAccountsTotalLedger = async (): Promise<void> => {
    const totalByAccount = await this.accountsTotal(
      this.query.query.fromDate,
      this.query.query.toDate,
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
      this.query.query.fromDate,
      this.query.query.toDate,
      this.transactionsGroupType,
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
      this.query.PPToDate,
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
      this.transactionsGroupType,
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
      this.query.PYToDate,
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
      this.transactionsGroupType,
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
  public accountsTotal = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
  ) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query) => {
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
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    datePeriodsType,
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
   * Common branches filter query.
   * @param {Knex.QueryBuilder} query
   */
  private commonFilterBranchesQuery = (query: Knex.QueryBuilder) => {
    if (!isEmpty(this.query.query.branchesIds)) {
      query.modify('filterByBranches', this.query.query.branchesIds);
    }
  };

  /**
   * Retrieve accounts of the report.
   * @return {Promise<IAccount[]>}
   */
  private getAccounts = () => {
    return this.accountModel().query();
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
        R.defaultTo([], this.accountsByType.get(accountType)),
      ),
      castArray,
    )(type);
  };
}
