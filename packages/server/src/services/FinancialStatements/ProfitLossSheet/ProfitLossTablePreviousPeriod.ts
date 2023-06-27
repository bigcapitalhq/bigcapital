import * as R from 'ramda';
import { IDateRange, ITableColumn, ITableColumnAccessor } from '@/interfaces';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { FinancialTablePreviousPeriod } from '../FinancialTablePreviousPeriod';

export const ProfitLossTablePreviousPeriod = (Base) =>
  class extends R.compose(FinancialTablePreviousPeriod)(Base) {
    query: ProfitLossSheetQuery;

    // ----------------------------
    // # Columns
    // ----------------------------
    /**
     * Retrieves pervious period comparison columns.
     * @returns {ITableColumn[]}
     */
    protected getPreviousPeriodColumns = (
      dateRange?: IDateRange
    ): ITableColumn[] => {
      return R.pipe(
        // Previous period columns.
        R.append(this.getPreviousPeriodTotalColumn(dateRange)),
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
     * Compose the previous period for date periods columns.
     * @params  {IDateRange}
     * @returns {ITableColumn[]}
     */
    protected getPreviousPeriodDatePeriodsPlugin = (
      dateRange: IDateRange
    ): ITableColumn[] => {
      const PPDateRange = this.getPPDatePeriodDateRange(
        dateRange.fromDate,
        dateRange.toDate,
        this.query.displayColumnsBy
      );
      return this.getPreviousPeriodColumns(PPDateRange);
    };

    // ----------------------------
    // # Accessors
    // ----------------------------
    /**
     * Retrieves previous period columns accessors.
     * @returns {ITableColumn[]}
     */
    protected previousPeriodColumnAccessor = (): ITableColumnAccessor[] => {
      return R.pipe(
        // Previous period columns.
        R.append(this.getPreviousPeriodTotalAccessor()),
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
     * Previous period column accessor.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected previousPeriodHorizontalColumnAccessors = (
      index: number
    ): ITableColumnAccessor[] => {
      return R.pipe(
        // Previous period columns.
        R.append(this.getPreviousPeriodTotalHorizAccessor(index)),
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
