import * as R from 'ramda';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialTablePreviousPeriod } from '../../common/FinancialTablePreviousPeriod';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import { IDateRange } from '../../types/Report.types';
import { ITableColumn } from '../../types/Table.types';
import { Constructor } from '@/common/types/Constructor';

export const BalanceSheetTablePreviousPeriod = <T extends Constructor>(Base: T) =>
  class BalanceSheetTablePreviousPeriod extends R.compose(
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
    public previousPeriodColumns = (
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
    public previousPeriodHorizontalColumns = (
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
    public previousPeriodColumnAccessor = (): ITableColumn[] => {
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
    public previousPeriodHorizColumnAccessors = (
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
