import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { flow } from 'fp-ts/function';
import { sumBy } from 'lodash';
import { ModelObject } from 'objection';
import { Account } from '@/modules/Accounts/models/Account.model';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { getMonthsKeys, getPeriodKey, getPeriodLabel } from './utils';
import {
  IBudgetVsActualAccountRow,
  IBudgetVsActualCell,
  IBudgetVsActualPeriod,
  IBudgetVsActualQuery,
  IBudgetVsActualReportData,
} from './BudgetVsActual.types';

export class BudgetVsActual extends flow(FinancialDatePeriods)(FinancialSheet) {
  public readonly repository: BudgetVsActualRepository;
  public readonly query: IBudgetVsActualQuery;
  public readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {BudgetVsActualRepository} repository - The report repository.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @param {I18nService} i18n - The i18n service.
   * @param {object} meta - The report meta.
   */
  constructor(
    repository: BudgetVsActualRepository,
    query: IBudgetVsActualQuery,
    i18n: I18nService,
    meta: { baseCurrency: string; dateFormat: string },
  ) {
    super();

    this.repository = repository;
    this.query = query;
    this.i18n = i18n;

    this.baseCurrency = meta.baseCurrency;
    this.dateFormat = meta.dateFormat;
    if (query.numberFormat) {
      this.numberFormat = query.numberFormat;
    }
  }

  /**
   * Retrieves the report data.
   * @returns {IBudgetVsActualReportData}
   */
  public reportData = (): IBudgetVsActualReportData => {
    const periods = this.getPeriods();
    const budgetAmounts = this.getBudgetAmountsByAccountPeriod();
    const actualAmounts = this.getActualAmountsByAccountPeriod();

    const accounts = this.repository.accounts.map((account) => {
      return this.getAccountRow(account, periods, budgetAmounts, actualAmounts);
    });

    // Totals of each period.
    const periodsTotals = periods.map((_period, index) => {
      const budget = sumBy(accounts, (row) => row.cells[index].budget);
      const actual = sumBy(accounts, (row) => row.cells[index].actual);

      return this.getTotalCell(budget, actual);
    });

    // Grand total row.
    const total = this.getTotalCell(
      sumBy(accounts, (row) => row.total.budget),
      sumBy(accounts, (row) => row.total.actual),
    );

    return {
      periods,
      accounts,
      totals: {
        periods: periodsTotals,
        total,
      },
    };
  };

  /**
   * Retrieves the report date periods.
   * @returns {IBudgetVsActualPeriod[]}
   */
  private getPeriods = (): IBudgetVsActualPeriod[] => {
    return this.repository.periods.map((period) => ({
      key: getPeriodKey(period.fromDate, this.query.displayColumnsBy),
      label: getPeriodLabel(period.fromDate, this.query.displayColumnsBy),
      fromDate: period.fromDate,
      toDate: period.toDate,
    }));
  };

  /**
   * Retrieves the budgeted amounts indexed by account id and month.
   * @returns {Map<string, number>}
   */
  private getBudgetAmountsByAccountPeriod = (): Map<string, number> => {
    const amounts = new Map<string, number>();

    this.repository.budgetEntries.forEach((entry) => {
      const key = `${entry.accountId}:${moment(entry.date).format('YYYY-MM')}`;
      amounts.set(key, (amounts.get(key) ?? 0) + Number(entry.amount));
    });
    return amounts;
  };

  /**
   * Retrieves the actual amounts indexed by account id and month.
   * @returns {Map<string, number>}
   */
  private getActualAmountsByAccountPeriod = (): Map<string, number> => {
    const amounts = new Map<string, number>();

    this.repository.actualTransactions.forEach((transaction) => {
      const account =
        transaction.account ??
        this.repository.accounts.find(
          (account) => account.id === transaction.accountId,
        );
      const credit = Number(transaction.credit) || 0;
      const debit = Number(transaction.debit) || 0;
      const amount =
        account?.accountNormal === 'credit' ? credit - debit : debit - credit;

      const key = `${transaction.accountId}:${moment(transaction.date).format(
        'YYYY-MM',
      )}`;
      amounts.set(key, (amounts.get(key) ?? 0) + amount);
    });
    return amounts;
  };

  /**
   * Retrieves the account report row.
   * @param {ModelObject<Account>} account
   * @param {IBudgetVsActualPeriod[]} periods
   * @param {Map<string, number>} budgetAmounts
   * @param {Map<string, number>} actualAmounts
   * @returns {IBudgetVsActualAccountRow}
   */
  private getAccountRow = (
    account: ModelObject<Account>,
    periods: IBudgetVsActualPeriod[],
    budgetAmounts: Map<string, number>,
    actualAmounts: Map<string, number>,
  ): IBudgetVsActualAccountRow => {
    const cells = periods.map((period) => {
      const monthsKeys = getMonthsKeys(period.fromDate, period.toDate);
      const budget = sumBy(
        monthsKeys,
        (monthKey) => budgetAmounts.get(`${account.id}:${monthKey}`) ?? 0,
      );
      const actual = sumBy(
        monthsKeys,
        (monthKey) => actualAmounts.get(`${account.id}:${monthKey}`) ?? 0,
      );
      return this.getCell(budget, actual);
    });

    return {
      accountId: account.id,
      accountCode: account.code,
      accountName: account.name,
      accountType: account.accountType,
      cells,
      total: this.getTotalOfCells(cells),
    };
  };

  /**
   * Retrieves the report cell of the given budgeted and actual amounts.
   * @param {number} budget - Budgeted amount.
   * @param {number} actual - Actual amount.
   * @returns {IBudgetVsActualCell}
   */
  private getCell = (budget: number, actual: number): IBudgetVsActualCell => {
    const variance = actual - budget;
    const percentage = budget !== 0 ? variance / budget : 0;

    return {
      budget,
      formattedBudget: this.formatNumber(budget),

      actual,
      formattedActual: this.formatNumber(actual),

      variance,
      formattedVariance: this.formatNumber(variance),

      percentage,
      formattedPercentage: this.formatPercentage(percentage),
    };
  };

  /**
   * Retrieves the report total cell of the given budgeted and actual amounts.
   * @param {number} budget - Budgeted amount.
   * @param {number} actual - Actual amount.
   * @returns {IBudgetVsActualCell}
   */
  private getTotalCell = (
    budget: number,
    actual: number,
  ): IBudgetVsActualCell => {
    const variance = actual - budget;
    const percentage = budget !== 0 ? variance / budget : 0;

    return {
      budget,
      formattedBudget: this.formatTotalNumber(budget),

      actual,
      formattedActual: this.formatTotalNumber(actual),

      variance,
      formattedVariance: this.formatTotalNumber(variance),

      percentage,
      formattedPercentage: this.formatTotalPercentage(percentage),
    };
  };

  /**
   * Retrieves the total cell of the given cells.
   * @param {IBudgetVsActualCell[]} cells
   * @returns {IBudgetVsActualCell}
   */
  private getTotalOfCells = (
    cells: IBudgetVsActualCell[],
  ): IBudgetVsActualCell => {
    return this.getTotalCell(sumBy(cells, 'budget'), sumBy(cells, 'actual'));
  };
}
