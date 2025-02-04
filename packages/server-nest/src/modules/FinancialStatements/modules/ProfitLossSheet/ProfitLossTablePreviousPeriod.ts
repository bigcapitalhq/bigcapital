// @ts-nocheck
import * as R from 'ramda';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialTablePreviousPeriod } from '../../common/FinancialTablePreviousPeriod';
import { FinancialSheet } from '../../common/FinancialSheet';
import { IDateRange } from '../../types/Report.types';

export const ProfitLossTablePreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends R.pipe(FinancialTablePreviousPeriod)(Base) {
    query: ProfitLossSheetQuery;

    // ----------------------------
    // # Columns
    // ----------------------------
    /**
     * Retrieves pervious period comparison columns.
     * @returns {ITableColumn[]}
     */
    protected getPreviousPeriodColumns = (
      dateRange?: IDateRange,
    ): ITableColumn[] => {
      return R.pipe(
        // Previous period columns.
        R.append(this.getPreviousPeriodTotalColumn(dateRange)),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          R.append(this.getPreviousPeriodChangeColumn()),
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageColumn()),
        ),
      )([]);
    };

    /**
     * Compose the previous period for date periods columns.
     * @params  {IDateRange}
     * @returns {ITableColumn[]}
     */
    protected getPreviousPeriodDatePeriodsPlugin = (
      dateRange: IDateRange,
    ): ITableColumn[] => {
      const PPDateRange = this.getPPDatePeriodDateRange(
        dateRange.fromDate,
        dateRange.toDate,
        this.query.displayColumnsBy,
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
          R.append(this.getPreviousPeriodChangeAccessor()),
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageAccessor()),
        ),
      )([]);
    };

    /**
     * Previous period period column accessor.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected previousPeriodHorizontalColumnAccessors = (
      index: number,
    ): ITableColumnAccessor[] => {
      return R.pipe(
        // Previous period columns.
        R.append(this.getPreviousPeriodTotalHorizAccessor(index)),
        R.when(
          this.query.isPreviousPeriodChangeActive,
          R.append(this.getPreviousPeriodChangeHorizAccessor(index)),
        ),
        R.when(
          this.query.isPreviousPeriodPercentageActive,
          R.append(this.getPreviousPeriodPercentageHorizAccessor(index)),
        ),
      )([]);
    };
  };
