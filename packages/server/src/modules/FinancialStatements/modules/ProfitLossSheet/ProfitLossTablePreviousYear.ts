import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { IDateRange } from '../CashFlowStatement/Cashflow.types';
import { FinancialTablePreviousYear } from '../../common/FinancialTablePreviousYear';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';

export const ProfitLossTablePreviousYear = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialTablePreviousYear, FinancialDateRanges)(Base) {
    query: ProfitLossSheetQuery;

    // ------------------------------------
    // # Columns.
    // ------------------------------------
    /**
     * Retrieves pervious year comparison columns.
     * @returns {ITableColumn[]}
     */
    protected getPreviousYearColumns = (
      dateRange?: IDateRange,
    ): ITableColumn[] => {
      return flow(
        // Previous year columns.
        (columns: ITableColumn[]) => [
          ...columns,
          this.getPreviousYearTotalColumn(dateRange),
        ],
        when(
          this.query.isPreviousYearChangeActive,
          (columns: ITableColumn[]) => [
            ...columns,
            this.getPreviousYearChangeColumn(),
          ],
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          (columns: ITableColumn[]) => [
            ...columns,
            this.getPreviousYearPercentageColumn(),
          ],
        ),
      )([]);
    };

    /**
     * Compose the previous year for date periods columns.
     * @param {IDateRange} dateRange
     * @returns {ITableColumn[]}
     */
    private previousYearDatePeriodColumnCompose = (
      dateRange: IDateRange,
    ): ITableColumn[] => {
      const PYDateRange = this.getPreviousYearDateRange(
        dateRange.fromDate,
        dateRange.toDate,
      );
      return this.getPreviousYearColumns(PYDateRange);
    };

    /**
     * Retrieves previous year date periods columns.
     * @param {IDateRange} dateRange
     * @returns {ITableColumn[]}
     */
    protected getPreviousYearDatePeriodColumnPlugin = (
      dateRange: IDateRange,
    ): ITableColumn[] => {
      return this.previousYearDatePeriodColumnCompose(dateRange);
    };

    // ---------------------------------------------------
    // # Accessors.
    // ---------------------------------------------------
    /**
     * Retrieves previous year columns accessors.
     * @returns {ITableColumnAccessor[]}
     */
    protected previousYearColumnAccessor = (): ITableColumnAccessor[] => {
      return flow(
        // Previous year columns.
        (accessors: ITableColumnAccessor[]) => [
          ...accessors,
          this.getPreviousYearTotalAccessor(),
        ],
        when(
          this.query.isPreviousYearChangeActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearChangeAccessor(),
          ],
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearPercentageAccessor(),
          ],
        ),
      )([]);
    };

    /**
     * Previous year period column accessor.
     * @param {number} index
     * @returns {ITableColumn[]}
     */
    protected previousYearHorizontalColumnAccessors = (
      index: number,
    ): ITableColumnAccessor[] => {
      return flow(
        // Previous year columns.
        (accessors: ITableColumnAccessor[]) => [
          ...accessors,
          this.getPreviousYearTotalHorizAccessor(index),
        ],
        when(
          this.query.isPreviousYearChangeActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearChangeHorizAccessor(index),
          ],
        ),
        when(
          this.query.isPreviousYearPercentageActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearPercentageHorizAccessor(index),
          ],
        ),
      )([]);
    };
  };
