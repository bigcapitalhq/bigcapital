import { flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { IDateRange } from '../../types/Report.types';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { FinancialTablePreviousYear } from '../../common/FinancialTablePreviousYear';
import { FinancialDateRanges } from '../../common/FinancialDateRanges';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BalanceSheetQuery } from './BalanceSheetQuery';

export const BalanceSheetTablePreviousYear = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialTablePreviousYear, FinancialDateRanges)(Base) {
    query: BalanceSheetQuery;

    // --------------------
    // # Columns.
    // --------------------
    /**
     * Retrieves pervious year comparison columns.
     * @returns {ITableColumn[]}
     */
    public getPreviousYearColumns = (
      dateRange?: IDateRange,
    ): ITableColumn[] => {
      return flow(
        // Previous year columns.
        when(this.query.isPreviousYearActive, (columns: ITableColumn[]) => [
          ...columns,
          this.getPreviousYearTotalColumn(dateRange),
        ]),
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
     *
     * @param {IDateRange} dateRange
     * @returns
     */
    public getPreviousYearHorizontalColumns = (dateRange: IDateRange) => {
      const PYDateRange = this.getPreviousYearDateRange(
        dateRange.fromDate,
        dateRange.toDate,
      );
      return this.getPreviousYearColumns(PYDateRange);
    };

    // --------------------
    // # Accessors.
    // --------------------
    /**
     * Retrieves previous year columns accessors.
     * @returns {ITableColumn[]}
     */
    public previousYearColumnAccessor = (): ITableColumnAccessor[] => {
      return flow(
        // Previous year columns.
        when(
          this.query.isPreviousYearActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearTotalAccessor(),
          ],
        ),
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
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    public previousYearHorizontalColumnAccessors = (
      index: number,
    ): ITableColumnAccessor[] => {
      return flow(
        // Previous year columns.
        when(
          this.query.isPreviousYearActive,
          (accessors: ITableColumnAccessor[]) => [
            ...accessors,
            this.getPreviousYearTotalHorizAccessor(index),
          ],
        ),
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
