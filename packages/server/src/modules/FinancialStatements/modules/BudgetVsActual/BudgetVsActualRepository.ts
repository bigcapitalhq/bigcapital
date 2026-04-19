import { Inject, Injectable, Scope } from '@nestjs/common';
import { ModelObject } from 'objection';
import * as R from 'ramda';
import { Knex } from 'knex';
import { isEmpty, castArray, sumBy } from 'lodash';
import * as moment from 'moment';
import { transformToMapBy } from '@/utils/transform-to-map-by';
import { BudgetVsActualQuery } from './BudgetVsActualQuery';
import { Ledger } from '@/modules/Ledger/Ledger';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';
import { IAccountTransactionsGroupBy } from '../../types/Report.types';
import { Account } from '@/modules/Accounts/models/Account.model';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '@/modules/Budgeting/models/Budget.model';
import { BudgetEntry } from '@/modules/Budgeting/models/BudgetEntry.model';
import { BUDGET_TYPE } from './constants';

@Injectable({ scope: Scope.TRANSIENT })
export class BudgetVsActualRepository extends R.compose(
  FinancialDatePeriods,
)(class {} as any) {
  @Inject(Account.name)
  public accountModel: TenantModelProxy<typeof Account>;

  @Inject(AccountTransaction.name)
  public accountTransactionModel: TenantModelProxy<typeof AccountTransaction>;

  @Inject(Budget.name)
  public budgetModel: TenantModelProxy<typeof Budget>;

  @Inject(BudgetEntry.name)
  public budgetEntryModel: TenantModelProxy<typeof BudgetEntry>;

  @Inject(TenancyContext)
  public tenancyContext: TenancyContext;

  public baseCurrency: string;
  public accounts: ModelObject<Account>[];
  public accountsByType: Map<string, ModelObject<Account>[]>;
  public accountsByParentType: Map<string, ModelObject<Account>[]>;
  public accountsGraph: any;

  public query: BudgetVsActualQuery;
  public transactionsGroupType: IAccountTransactionsGroupBy =
    IAccountTransactionsGroupBy.Month;

  public budget: Budget;

  public totalAccountsLedger: Ledger;
  public periodsAccountsLedger: Ledger;
  public periodsOpeningAccountLedger: Ledger;

  public budgetTotalByAccount: Map<number, number>;
  public budgetPeriodsByAccount: Map<string, Map<number, number>>;

  setFilter(query: IBudgetVsActualQuery) {
    this.query = new BudgetVsActualQuery(query);

    this.transactionsGroupType = this.getGroupByFromDisplayColumnsBy(
      this.query.displayColumnsBy as any,
    );
  }

  public asyncInitialize = async () => {
    await this.initBaseCurrency();
    await this.initBudget();
    await this.initAccounts();
    await this.initAccountsGraph();

    if (this.isProfitAndLoss()) {
      await this.initAccountsTotalLedger();
    } else {
      await this.initClosingAccountsTotalLedger();
    }

    await this.initBudgetEntries();

    if (this.query.isDatePeriodsColumnsType()) {
      if (this.isProfitAndLoss()) {
        await this.initTotalDatePeriods();
      } else {
        await this.initBSTotalDatePeriods();
      }
      await this.initBudgetDatePeriods();
    }
  };

  private isProfitAndLoss = (): boolean => {
    return this.budget.budgetType === BUDGET_TYPE.PROFIT_AND_LOSS;
  };

  private initBaseCurrency = async () => {
    const metadata = await this.tenancyContext.getTenantMetadata();
    this.baseCurrency = metadata.baseCurrency;
  };

  private initBudget = async () => {
    this.budget = await this.budgetModel()
      .query()
      .findById(this.query.budgetId)
      .withGraphFetched('entries');
  };

  private initAccounts = async () => {
    const accounts = await this.getAccounts();
    this.accounts = accounts;
    this.accountsByType = transformToMapBy(accounts, 'accountType');
    this.accountsByParentType = transformToMapBy(accounts, 'accountParentType');
  };

  private initAccountsGraph = async () => {
    this.accountsGraph = this.accountModel().toDependencyGraph(this.accounts);
  };

  private initAccountsTotalLedger = async () => {
    const totalByAccount = await this.accountsTotal(
      this.query.fromDate,
      this.query.toDate,
    );
    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccount);
  };

  private initClosingAccountsTotalLedger = async () => {
    const totalByAccount = await this.closingAccountsTotal(
      this.query.toDate,
    );
    this.totalAccountsLedger = Ledger.fromTransactions(totalByAccount);
  };

  private initTotalDatePeriods = async () => {
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.fromDate,
      this.query.toDate,
      this.transactionsGroupType,
    );
    this.periodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
  };

  private initBSTotalDatePeriods = async () => {
    const periodsByAccount = await this.accountsDatePeriods(
      this.query.fromDate,
      this.query.toDate,
      this.transactionsGroupType,
    );
    const periodsOpeningByAccount = await this.closingAccountsTotal(
      this.query.fromDate,
    );
    this.periodsAccountsLedger = Ledger.fromTransactions(periodsByAccount);
    this.periodsOpeningAccountLedger = Ledger.fromTransactions(
      periodsOpeningByAccount,
    );
  };

  private initBudgetEntries = async () => {
    const q = this.budgetEntryModel()
      .query()
      .where('budget_id', this.budget.id);

    if (this.query.fromDate) {
      q.where('period_date', '>=', this.query.fromDate);
    }
    if (this.query.toDate) {
      q.where('period_date', '<=', this.query.toDate);
    }

    const entries: BudgetEntry[] = await q;

    this.budgetTotalByAccount = entries.reduce((map, entry) => {
      const existing = map.get(entry.accountId) || 0;
      map.set(entry.accountId, existing + entry.amount);
      return map;
    }, new Map<number, number>());
  };

  private initBudgetDatePeriods = async () => {
    const fromDate = this.query.fromDate || this.budget.startDate;
    const toDate = this.query.toDate || this.budget.endDate;

    const q = this.budgetEntryModel()
      .query()
      .where('budget_id', this.budget.id)
      .where('period_date', '>=', fromDate)
      .where('period_date', '<=', toDate);

    const entries: BudgetEntry[] = await q;

    const periodsMap = new Map<string, Map<number, number>>();
    const dateRanges = this.getDateRanges(
      fromDate,
      toDate,
      this.query.getPeriodsUnit(),
    );

    entries.forEach((entry) => {
      const entryDate = moment(entry.periodDate);
      const periodKey = this.findPeriodKeyForDate(entryDate, dateRanges);

      if (!periodsMap.has(periodKey)) {
        periodsMap.set(periodKey, new Map());
      }
      const periodMap = periodsMap.get(periodKey);
      periodMap.set(entry.accountId, (periodMap.get(entry.accountId) || 0) + entry.amount);
    });

    this.budgetPeriodsByAccount = periodsMap;
  };

  private findPeriodKeyForDate = (
    entryDate: moment.Moment,
    dateRanges: Array<{ fromDate: Date; toDate: Date }>,
  ): string => {
    for (const range of dateRanges) {
      if (
        (entryDate.isSameOrAfter(moment(range.fromDate)) &&
          entryDate.isSameOrBefore(moment(range.toDate))) ||
        entryDate.isSame(moment(range.fromDate), 'month')
      ) {
        return `${moment(range.fromDate).format('YYYY-MM-DD')}_${moment(range.toDate).format('YYYY-MM-DD')}`;
      }
    }
    return `${moment(entryDate).startOf('month').format('YYYY-MM-DD')}_${moment(entryDate).endOf('month').format('YYYY-MM-DD')}`;
  };

  public accountsTotal = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
  ) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query: any) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('accountId');
        query.select(['accountId']);

        query.modify('filterDateRange', fromDate, toDate);
        query.withGraphFetched('account');

        this.commonFilterBranchesQuery(query);
      });
  };

  public closingAccountsTotal = async (toDate: moment.MomentInput) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query: any) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.groupBy('accountId');
        query.select(['accountId']);

        query.modify('filterDateRange', null, toDate);
        query.withGraphFetched('account');

        this.commonFilterBranchesQuery(query);
      });
  };

  public accountsDatePeriods = async (
    fromDate: moment.MomentInput,
    toDate: moment.MomentInput,
    datePeriodsType: IAccountTransactionsGroupBy,
  ) => {
    return this.accountTransactionModel()
      .query()
      .onBuild((query: any) => {
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

  private commonFilterBranchesQuery = (query: any) => {
    if (!isEmpty(this.query.branchesIds)) {
      query.modify('filterByBranches', this.query.branchesIds);
    }
  };

  public getAccounts = () => {
    return this.accountModel().query();
  };

  public getAccountsByType = (type: string[] | string): ModelObject<Account>[] => {
    const types = castArray(type) as string[];
    const result: ModelObject<Account>[] = [];
    types.forEach((accountType) => {
      const accounts = this.accountsByType.get(accountType) || [];
      result.push(...accounts);
    });
    return result;
  };

  public getBudgetAmountForAccounts = (accountIds: number[]): number => {
    let total = 0;
    accountIds.forEach((id) => {
      total += this.budgetTotalByAccount.get(id) || 0;
    });
    return total;
  };

  public getActualClosingBalance = (accountIds: number[]): number => {
    return this.totalAccountsLedger
      .whereAccountsIds(accountIds)
      .getClosingBalance();
  };
}
