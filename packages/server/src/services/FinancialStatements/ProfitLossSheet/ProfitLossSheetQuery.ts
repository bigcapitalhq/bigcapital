import { IFinancialDatePeriodsUnit, IProfitLossSheetQuery } from '@/interfaces';
import { merge } from 'lodash';
import * as R from 'ramda';
import { FinancialDateRanges } from '../FinancialDateRanges';
import { DISPLAY_COLUMNS_BY } from './constants';

export class ProfitLossSheetQuery extends R.compose(FinancialDateRanges)(class {}) {
  /**
   * P&L query.
   * @param {IProfitLossSheetQuery}
   */
  public readonly query: IProfitLossSheetQuery;

  /**
   * Previous year to date.
   * @param {Date}
   */
  public readonly PYToDate: Date;
  /**
   * Previous year from date.
   * @param {Date}
   */
  public readonly PYFromDate: Date;
  /**
   * Previous period to date.
   * @param {Date}
   */
  public readonly PPToDate: Date;
  /**
   * Previous period from date.
   * @param {Date}
   */
  public readonly PPFromDate: Date;

  /**
   * Constructor method.
   * @param {IProfitLossSheetQuery} query
   */
  constructor(query: IProfitLossSheetQuery) {
    super();
    this.query = query;

    // Pervious Year (PY) Dates.
    this.PYToDate = this.getPreviousYearDate(this.query.toDate);
    this.PYFromDate = this.getPreviousYearDate(this.query.fromDate);

    // Previous Period (PP) Dates for total column..
    if (this.isTotalColumnType()) {
      const { fromDate, toDate } = this.getPPTotalDateRange(this.query.fromDate, this.query.toDate);
      this.PPToDate = toDate;
      this.PPFromDate = fromDate;

      // Previous period (PP) dates for date periods columns type.
    } else if (this.isDatePeriodsColumnsType()) {
      const { fromDate, toDate } = this.getPPDatePeriodDateRange(
        this.query.fromDate,
        this.query.toDate,
        this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
      );
      this.PPToDate = toDate;
      this.PPFromDate = fromDate;
    }
    return merge(this, query);
  }

  /**
   * Detarmines the given display columns type.
   * @param   {string} displayColumnsBy
   * @returns {boolean}
   */
  public isDisplayColumnsBy = (displayColumnsBy: string): boolean => {
    return this.query.displayColumnsBy === displayColumnsBy;
  };

  /**
   * Detarmines the given display columns by type.
   * @param   {string} displayColumnsBy
   * @returns {boolean}
   */
  public isDisplayColumnsType = (displayColumnsType: string): boolean => {
    return this.query.displayColumnsType === displayColumnsType;
  };

  /**
   * Detarmines whether the columns type is date periods.
   * @returns {boolean}
   */
  public isDatePeriodsColumnsType = (): boolean => {
    return this.isDisplayColumnsType(DISPLAY_COLUMNS_BY.DATE_PERIODS);
  };

  /**
   * Detarmines whether the columns type is total.
   * @returns {boolean}
   */
  public isTotalColumnType = (): boolean => {
    return this.isDisplayColumnsType(DISPLAY_COLUMNS_BY.TOTAL);
  };

  // --------------------------------------
  // # Previous Year (PY)
  // --------------------------------------
  /**
   * Detarmines the report query has previous year enabled.
   * @returns {boolean}
   */
  public isPreviousYearActive = (): boolean => {
    return this.query.previousYear;
  };

  /**
   * Detarmines the report query has previous year percentage change active.
   * @returns {boolean}
   */
  public isPreviousYearPercentageActive = (): boolean => {
    return this.query.previousYearPercentageChange;
  };

  /**
   * Detarmines the report query has previous year change active.
   * @returns {boolean}
   */
  public isPreviousYearChangeActive = (): boolean => {
    return this.query.previousYearAmountChange;
  };

  /**
   * Retrieves PY date based on the current query.
   * @returns {Date}
   */
  public getTotalPreviousYear = (): Date => {
    return this.PYFromDate;
  };

  // --------------------------------------
  // # Previous Period (PP)
  // --------------------------------------
  /**
   * Detarmines the report query has previous period enabled.
   * @returns {boolean}
   */
  public isPreviousPeriodActive = (): boolean => {
    return this.query.previousPeriod;
  };

  /**
   * Detarmines the report query has previous period percentage change active.
   * @returns {boolean}
   */
  public isPreviousPeriodPercentageActive = (): boolean => {
    return this.query.previousPeriodPercentageChange;
  };

  /**
   * Detarmines the report query has previous period change active.
   * @returns {boolean}
   */
  public isPreviousPeriodChangeActive = (): boolean => {
    return this.query.previousPeriodAmountChange;
  };

  /**
   * Retrieves previous period date based on the current query.
   * @returns {Date}
   */
  public getTotalPreviousPeriod = (): Date => {
    return this.PPFromDate;
  };

  // --------------------------------------
  // # Percentage vertical/horizontal.
  // --------------------------------------
  /**
   * Detarmines whether percentage of expenses is active.
   * @returns {boolean}
   */
  public isExpensesPercentage = (): boolean => {
    return this.query.percentageExpense;
  };

  /**
   * Detarmines whether percentage of income is active.
   * @returns {boolean}
   */
  public isIncomePercentage = (): boolean => {
    return this.query.percentageIncome;
  };

  /**
   * Detarmines whether percentage of column is active.
   * @returns {boolean}
   */
  public isColumnPercentage = (): boolean => {
    return this.query.percentageColumn;
  };

  /**
   * Detarmines whether percentage of row is active.
   * @returns {boolean}
   */
  public isRowPercentage = (): boolean => {
    return this.query.percentageRow;
  };
}
