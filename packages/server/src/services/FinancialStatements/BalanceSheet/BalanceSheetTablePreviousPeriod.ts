import * as R from 'ramda';
import { IDateRange, ITableColumn } from '@/interfaces';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialTablePreviousPeriod } from '../FinancialTablePreviousPeriod';
import { FinancialDateRanges } from '../FinancialDateRanges';

export const BalanceSheetTablePreviousPeriod = (Base) =>
  class extends R.compose(
    FinancialTablePreviousPeriod,
    FinancialDateRanges
  )(Base) {
    readonly query: BalanceSheetQuery;

    // --------------------
    // # Columns
    // --------------------
    /**
     * Retrieves the previous period columns.
     * @returns {ITableColumn[]}
     */
    protected previousPeriodColumns = (
      dateRange?: IDateRange
    ): ITableColumn[] => {
      return R.pipe(
        // Previous period columns.
        R.when(
          this.query.isPreviousPeriodActive,
          R.append(this.getPreviousPeriodTotalColumn(dateRange))
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          R.append(this.getPreviousPeriodChangeColumn())
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageColumn())
        )
      )([]);
    };

    /**
     * Previous period for date periods
     * @param   {IDateRange} dateRange
     * @returns {ITableColumn}
     */
    protected previousPeriodHorizontalColumns = (
      dateRange: IDateRange
    ): ITableColumn[] => {
      const PPDateRange = this.getPPDatePeriodDateRange(
        dateRange.fromDate,
        dateRange.toDate,
        this.query.displayColumnsBy
      );
      return this.previousPeriodColumns({
        fromDate: PPDateRange.fromDate,
        toDate: PPDateRange.toDate,
      });
    };

    // --------------------
    // # Accessors
    // --------------------
    /**
     * Retrieves previous period columns accessors.
     * @returns {ITableColumn[]}
     */
    protected previousPeriodColumnAccessor = (): ITableColumn[] => {
      return R.pipe(
        // Previous period columns.
        R.when(
          this.query.isPreviousPeriodActive,
          R.append(this.getPreviousPeriodTotalAccessor())
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          R.append(this.getPreviousPeriodChangeAccessor())
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageAccessor())
        )
      )([]);
    };

    /**
     *
     * @param   {number} index
     * @returns
     */
    protected previousPeriodHorizColumnAccessors = (
      index: number
    ): ITableColumn[] => {
      return R.pipe(
        // Previous period columns.
        R.when(
          this.query.isPreviousPeriodActive,
          R.append(this.getPreviousPeriodTotalHorizAccessor(index))
        ),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          R.append(this.getPreviousPeriodChangeHorizAccessor(index))
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageHorizAccessor(index))
        )
      )([]);
    };
  };
