import { Inject, Injectable, Scope } from '@nestjs/common';
import * as moment from 'moment';
import { isEmpty, uniq } from 'lodash';
import { ModelObject } from 'objection';
import { flow } from 'fp-ts/function';
import { Budget } from '@/modules/Budgets/models/Budget';
import { BudgetEntry } from '@/modules/Budgets/models/BudgetEntry';
import { Account } from '@/modules/Accounts/models/Account.model';
import { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { FinancialSheet } from '../../common/FinancialSheet';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';

@Injectable({ scope: Scope.TRANSIENT })
export class BudgetVsActualRepository extends flow(FinancialDatePeriods)(
  class {} as GConstructor<FinancialSheet>,
) {
  @Inject(Budget.name)
  public budgetModel: TenantModelProxy<typeof Budget>;

  @Inject(BudgetEntry.name)
  public budgetEntryModel: TenantModelProxy<typeof BudgetEntry>;

  @Inject(AccountTransaction.name)
  public accountTransactionModel: TenantModelProxy<typeof AccountTransaction>;

  @Inject(Account.name)
  public accountModel: TenantModelProxy<typeof Account>;

  @Inject(TenancyContext)
  public tenancyContext: TenancyContext;

  /**
   * The report query.
   */
  public query: IBudgetVsActualQuery;

  /**
   * The report budget.
   */
  public budget: ModelObject<Budget>;

  /**
   * The budget entries of the report.
   */
  public budgetEntries: ModelObject<BudgetEntry>[] = [];

  /**
   * The actual transactions of the report grouped by account and month.
   */
  public actualTransactions: ModelObject<AccountTransaction>[] = [];

  /**
   * The accounts of the report.
   */
  public accounts: ModelObject<Account>[] = [];

  /**
   * The report date periods.
   */
  public periods: { fromDate: string; toDate: string }[] = [];

  /**
   * Sets the report filter query.
   * @param {IBudgetVsActualQuery} query
   */
  public setFilter(query: IBudgetVsActualQuery): void {
    this.query = query;
  }

  /**
   * Async report repository initialization.
   */
  public asyncInitialize = async (): Promise<void> => {
    await this.initBaseCurrency();
    await this.initBudget();
    this.initQuery();
    await this.initBudgetEntries();
    await this.initActualTransactions();
    await this.initAccounts();
    this.initPeriods();
  };

  /**
   * Initialize the base currency.
   */
  private initBaseCurrency = async (): Promise<void> => {
    const metadata = await this.tenancyContext.getTenantMetadata();

    this.baseCurrency = metadata?.baseCurrency;
  };

  /**
   * Initialize the report budget.
   */
  private initBudget = async (): Promise<void> => {
    this.budget = await this.budgetModel()
      .query()
      .findById(this.query.budgetId)
      .throwIfNotFound();
  };

  /**
   * Initialize the report query defaults from the budget.
   */
  private initQuery = (): void => {
    this.query = {
      ...this.query,
      fromDate: moment(this.query.fromDate || this.budget.fromDate).format(
        'YYYY-MM-DD',
      ),
      toDate: moment(this.query.toDate || this.budget.toDate).format(
        'YYYY-MM-DD',
      ),
    };
  };

  /**
   * Initialize the budget entries of the report.
   */
  private initBudgetEntries = async (): Promise<void> => {
    const query = this.budgetEntryModel()
      .query()
      .where('budgetId', this.budget.id)
      .where(
        'date',
        '>=',
        moment(this.query.fromDate).startOf('month').format('YYYY-MM-DD'),
      )
      .where(
        'date',
        '<=',
        moment(this.query.toDate).endOf('month').format('YYYY-MM-DD'),
      )
      .withGraphFetched('account');

    if (!isEmpty(this.query.accountsIds)) {
      query.whereIn('accountId', this.query.accountsIds);
    }
    this.budgetEntries = await query;
  };

  /**
   * Initialize the actual transactions of the report.
   */
  private initActualTransactions = async (): Promise<void> => {
    this.actualTransactions = await this.accountTransactionModel()
      .query()
      .onBuild((query) => {
        query.sum('credit as credit');
        query.sum('debit as debit');
        query.select(['accountId']);
        query.groupBy('accountId');

        query.modify('groupByDateFormat', 'month');
        query.modify('filterDateRange', this.query.fromDate, this.query.toDate);
        query.withGraphFetched('account');

        if (!isEmpty(this.query.accountsIds)) {
          query.modify('filterAccounts', this.query.accountsIds);
        }
        if (!isEmpty(this.query.branchesIds)) {
          query.modify('filterByBranches', this.query.branchesIds);
        }
      });
  };

  /**
   * Initialize the accounts of the report.
   */
  private initAccounts = async (): Promise<void> => {
    const accountsIds = uniq([
      ...this.budgetEntries.map((entry) => entry.accountId),
      ...this.actualTransactions.map((transaction) => transaction.accountId),
    ]);
    if (accountsIds.length === 0) {
      this.accounts = [];
      return;
    }
    this.accounts = await this.accountModel()
      .query()
      .whereIn('id', accountsIds)
      .orderBy('code', 'ASC');
  };

  /**
   * Initialize the report date periods.
   */
  private initPeriods = (): void => {
    this.periods = this.getDateRanges(
      this.query.fromDate,
      this.query.toDate,
      this.query.displayColumnsBy,
    );
  };
}
