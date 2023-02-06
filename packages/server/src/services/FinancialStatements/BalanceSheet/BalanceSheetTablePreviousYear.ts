import * as R from 'ramda';
import { IDateRange, ITableColumn } from '@/interfaces';
import { FinancialTablePreviousYear } from '../FinancialTablePreviousYear';
import { FinancialDateRanges } from '../FinancialDateRanges';

export const BalanceSheetTablePreviousYear = (Base) =>
  class extends R.compose(FinancialTablePreviousYear, FinancialDateRanges)(Base) {
    // --------------------
    // # Columns.
    // --------------------
    /**
     * Retrieves pervious year comparison columns.
     * @returns {ITableColumn[]}
     */
    protected getPreviousYearColumns = (
      dateRange?: IDateRange
    ): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalColumn(dateRange))
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeColumn())
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageColumn())
        )
      )([]);
    };

    /**
     * 
     * @param {IDateRange} dateRange
     * @returns
     */
    protected getPreviousYearHorizontalColumns = (dateRange: IDateRange) => {
      const PYDateRange = this.getPreviousYearDateRange(
        dateRange.fromDate,
        dateRange.toDate
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
    protected previousYearColumnAccessor = (): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalAccessor())
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeAccessor())
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageAccessor())
        )
      )([]);
    };

    /**
     * Previous year period column accessor.
     * @param   {number} index
     * @returns {ITableColumn[]}
     */
    protected previousYearHorizontalColumnAccessors = (
      index: number
    ): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalHorizAccessor(index))
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeHorizAccessor(index))
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageHorizAccessor(index))
        )
      )([]);
    };
  };
