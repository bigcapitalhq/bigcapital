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
import { CashBasisProjection } from '../../_shared/CashBasisProjection.service';

// Document GL rows that only exist on accrual basis. PaymentReceive / BillPayment
// already move cash↔AR/AP (not revenue/expense), so dropping these still leaves
// the cash side of the books intact; the missing revenue/expense legs are
// synthesized by CashBasisProjection.
const ACCRUAL_ONLY_REFERENCE_TYPES = [
  'SaleInvoice',
  'Bill',
  'CreditNote',
  'VendorCredit',
];

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

  @Inject(CashBasisProjection)
  public cashBasisProjection: CashBasisProjection;

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
    if (this.isCashBasis()) {
      return this.cashBasisAccountsTotal(fromDate, toDate);
    }
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
    if (this.isCashBasis()) {
      return this.cashBasisAccountsDatePeriods(
        fromDate,
        toDate,
        datePeriodsType,
      );
    }
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

  private isCashBasis = (): boolean => {
    return this.query?.query?.basis === 'cash';
  };

  /**
   * Cash-basis variant of accountsTotal. Excludes accrual-only document GL
   * rows (SaleInvoice / Bill / CreditNote / VendorCredit), then unions with
   * synthetic rows projected from PaymentReceive / BillPayment / refund
   * events at the payment date.
   */
  private cashBasisAccountsTotal = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
  ) => {
    const directRows = await this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('accountId');
        query.select(['accountId']);

        query.modify('filterDateRange', fromDate, toDate);
        query.whereNotIn('referenceType', ACCRUAL_ONLY_REFERENCE_TYPES);
        query.withGraphFetched('account');

        this.commonFilterBranchesQuery(query);
      });
    const projectedRows = await this.cashBasisProjection.aggregateTotals(
      fromDate,
      toDate,
      this.query.query.branchesIds,
    );
    return this.mergeAccountAggregates(directRows, projectedRows);
  };

  /**
   * Cash-basis variant of accountsDatePeriods. Same merge strategy as
   * cashBasisAccountsTotal, plus a period bucket so each (accountId, period)
   * pair stays distinct.
   */
  private cashBasisAccountsDatePeriods = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    datePeriodsType,
  ) => {
    const directRows = await this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('accountId');
        query.select(['accountId']);

        query.modify('groupByDateFormat', datePeriodsType);
        query.modify('filterDateRange', fromDate, toDate);
        query.whereNotIn('referenceType', ACCRUAL_ONLY_REFERENCE_TYPES);
        query.withGraphFetched('account');

        this.commonFilterBranchesQuery(query);
      });
    const projectedRows = await this.cashBasisProjection.aggregatePeriods(
      fromDate,
      toDate,
      this.query.query.branchesIds,
      datePeriodsType,
    );
    return this.mergeAccountAggregates(directRows, projectedRows, true);
  };

  /**
   * Merges direct-query account aggregates with synthetic projected aggregates.
   * Re-fetches Account models for accountIds present only in the projection so
   * downstream `Ledger.mapTransaction` can still read `account.accountNormal`.
   */
  private mergeAccountAggregates = async (
    directRows: any[],
    projectedRows: any[],
    keyByPeriod = false,
  ) => {
    const keyOf = (row) =>
      keyByPeriod ? `${row.accountId}|${row.date}` : `${row.accountId}`;

    const map = new Map<string, any>();
    for (const row of directRows) {
      map.set(keyOf(row), row);
    }

    const missingAccountIds = new Set<number>();
    for (const row of projectedRows) {
      if (
        !map.has(keyOf(row)) &&
        !directRows.some((d) => d.accountId === row.accountId)
      ) {
        missingAccountIds.add(row.accountId);
      }
    }
    const accountsById = new Map<number, any>();
    if (missingAccountIds.size > 0) {
      const accounts = await this.accountModel()
        .query()
        .whereIn('id', Array.from(missingAccountIds));
      for (const acc of accounts) {
        accountsById.set(acc.id, acc);
      }
    }

    for (const row of projectedRows) {
      const key = keyOf(row);
      const existing = map.get(key);
      if (existing) {
        existing.credit = (Number(existing.credit) || 0) + (row.credit || 0);
        existing.debit = (Number(existing.debit) || 0) + (row.debit || 0);
      } else {
        const account =
          directRows.find((d) => d.accountId === row.accountId)?.account ??
          accountsById.get(row.accountId);
        const merged: any = {
          accountId: row.accountId,
          credit: row.credit || 0,
          debit: row.debit || 0,
          account,
        };
        if (keyByPeriod) merged.date = row.date;
        map.set(key, merged);
      }
    }
    return Array.from(map.values());
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
