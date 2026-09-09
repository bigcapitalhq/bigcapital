import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialTablePreviousPeriod } from '../../common/FinancialTablePreviousPeriod';
import { FinancialSheet } from '../../common/FinancialSheet';
import {
  IDateRange,
  IFinancialDatePeriodsUnit,
} from '../../types/Report.types';

export const ProfitLossTablePreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialTablePreviousPeriod)(Base) {
    query: ProfitLossSheetQuery;

    protected getPPDatePeriodDateRange: (fromDate, toDate, unit) => IDateRange;

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
      return flow(
        // Previous period columns.
        (columns: ITableColumn[]) => [
          ...columns,
          this.getPreviousPeriodTotalColumn(dateRange),
        ],
        when(
          this.query.isPreviousPeriodChangeActive,
          (columns: ITableColumn[]) => [
            ...columns,
            this.getPreviousPeriodChangeColumn(),
          ],
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          (columns: ITableColumn[]) => [
            ...columns,
            this.getPreviousPeriodPercentageColumn(),
          ],
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
        this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
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
      return flow(
        // Previous period columns.
        (accessors: ITableColumnAccessor[]) => [
          ...accessors,
          this.getPreviousPeriodTotalAccessor(),
        ],
        when(
          this.query.isPreviousPeriodChangeActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodChangeAccessor(),
          ],
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodPercentageAccessor(),
          ],
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
      return flow(
        // Previous period columns.
        (accessors: ITableColumnAccessor[]) => [
          ...accessors,
          this.getPreviousPeriodTotalHorizAccessor(index),
        ],
        when(
          this.query.isPreviousPeriodChangeActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodChangeHorizAccessor(index),
          ],
        ),
        when(
          this.query.isPreviousPeriodPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodPercentageHorizAccessor(index),
          ],
        ),
      )([]);
    };
  };
