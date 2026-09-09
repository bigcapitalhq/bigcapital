import { flow } from 'fp-ts/function';
import * as moment from 'moment';
import { merge } from 'lodash';
import {
  IBalanceSheetQuery,
  IFinancialDatePeriodsUnit,
} from './BalanceSheet.types';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import { DISPLAY_COLUMNS_BY } from './constants';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { INumberFormatQuery } from '../../types/Report.types';

export class BalanceSheetQuery extends flow(FinancialDateRanges)(
  class {} as GConstructor<FinancialSheet>,
) {
  /**
   * Balance sheet query.
   * @param {IBalanceSheetQuery}
   */
  public readonly query: IBalanceSheetQuery;

  public basis: 'cash' | 'accrual';
  public fromDate: moment.MomentInput;
  public toDate: moment.MomentInput;
  public numberFormat: INumberFormatQuery;
  public noneZero: boolean;
  public noneTransactions: boolean;
  public accountIds: number[];
  public branchesIds: number[];
  public displayColumnsType: 'total' | 'date_periods';
  public displayColumnsBy: string;
  public percentageOfColumn: boolean;
  public percentageOfRow: boolean;
  public previousPeriod: boolean;
  public previousPeriodAmountChange: boolean;
  public previousPeriodPercentageChange: boolean;
  public previousYear: boolean;
  public previousYearAmountChange: boolean;
  public previousYearPercentageChange: boolean;

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
   * Constructor method
   * @param {IBalanceSheetQuery} query
   */
  constructor(query: IBalanceSheetQuery) {
    super();
    this.query = query;

    // Pervious Year (PY) Dates.
    this.PYToDate = this.getPreviousYearDate(this.query.toDate);
    this.PYFromDate = this.getPreviousYearDate(this.query.fromDate);

    // Previous Period (PP) Dates for Total column.
    if (this.isTotalColumnType()) {
      const { fromDate, toDate } = this.getPPTotalDateRange(
        this.query.fromDate,
        this.query.toDate,
      );
      this.PPToDate = toDate;
      this.PPFromDate = fromDate;
      // Previous Period (PP) Dates for Date period columns type.
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

  // ---------------------------
  // # Columns Type/By.
  // ---------------------------
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

  // ---------------------------
  // # Percentage column/row.
  // ---------------------------
  /**
   * Detarmines whether the percentage of column active.
   * @returns {boolean}
   */
  public isColumnsPercentageActive = (): boolean => {
    return this.query.percentageOfColumn;
  };

  /**
   * Detarmines whether the percentage of row active.
   * @returns {boolean}
   */
  public isRowsPercentageActive = (): boolean => {
    return this.query.percentageOfRow;
  };

  // ---------------------------
  // # Previous Year (PY)
  // ---------------------------
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

  // ---------------------------
  // # Previous Period (PP).
  // ---------------------------
  /**
   * Detarmines the report query has previous period enabled.
   * @returns {boolean}
   */
  public isPreviousPeriodActive = (): boolean => {
    return this.query.previousPeriod;
  };

  /**
   * Detarmines wether the preivous period percentage is active.
   * @returns {boolean}
   */
  public isPreviousPeriodPercentageActive = (): boolean => {
    return this.query.previousPeriodPercentageChange;
  };

  /**
   * Detarmines wether the previous period change is active.
   * @returns {boolean}
   */
  public isPreviousPeriodChangeActive = (): boolean => {
    return this.query.previousPeriodAmountChange;
  };
}
