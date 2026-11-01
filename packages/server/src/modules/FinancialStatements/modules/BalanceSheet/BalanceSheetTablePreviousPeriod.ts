import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { FinancialTablePreviousPeriod } from '../../common/FinancialTablePreviousPeriod';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import {
  IDateRange,
  IFinancialDatePeriodsUnit,
} from '../../types/Report.types';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export const BalanceSheetTablePreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class BalanceSheetTablePreviousPeriod extends flow(
    FinancialTablePreviousPeriod,
    FinancialDateRanges,
  )(Base) {
    readonly query: BalanceSheetQuery;

    // --------------------
    // # Columns
    // --------------------
    /**
     * Retrieves the previous period columns.
     * @returns {ITableColumn[]}
     */
    public previousPeriodColumns = (dateRange?: IDateRange): ITableColumn[] => {
      return flow(
        // Previous period columns.
        when(this.query.isPreviousPeriodActive, (columns: ITableColumn[]) => [
          ...columns,
          this.getPreviousPeriodTotalColumn(dateRange),
        ]),
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
     * Previous period for date periods
     * @param   {IDateRange} dateRange
     * @returns {ITableColumn}
     */
    public previousPeriodHorizontalColumns = (
      dateRange: IDateRange,
    ): ITableColumn[] => {
      const PPDateRange = this.getPPDatePeriodDateRange(
        dateRange.fromDate,
        dateRange.toDate,
        this.query.displayColumnsBy as IFinancialDatePeriodsUnit,
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
    public previousPeriodColumnAccessor = (): ITableColumnAccessor[] => {
      return flow(
        // Previous period columns.
        when(
          this.query.isPreviousPeriodActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodTotalAccessor(),
          ],
        ),
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
     *
     * @param   {number} index
     * @returns
     */
    public previousPeriodHorizColumnAccessors = (
      index: number,
    ): ITableColumnAccessor[] => {
      return flow(
        // Previous period columns.
        when(
          this.query.isPreviousPeriodActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousPeriodTotalHorizAccessor(index),
          ],
        ),
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
