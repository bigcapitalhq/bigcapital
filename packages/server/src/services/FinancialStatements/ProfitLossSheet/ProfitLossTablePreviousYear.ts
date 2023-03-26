import * as R from 'ramda';
import { IDateRange, ITableColumn, ITableColumnAccessor } from '@/interfaces';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { FinancialTablePreviousYear } from '../FinancialTablePreviousYear';
import { FinancialDateRanges } from '../FinancialDateRanges';

export const ProfitLossTablePreviousYear = (Base) =>
  class extends R.compose(
    FinancialTablePreviousYear,
    FinancialDateRanges
  )(Base) {
    query: ProfitLossSheetQuery;

    // ------------------------------------
    // # Columns.
    // ------------------------------------
    /**
     * Retrieves pervious year comparison columns.
     * @returns {ITableColumn[]}
     */
    protected getPreviousYearColumns = (
      dateRange?: IDateRange
    ): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.append(this.getPreviousYearTotalColumn(dateRange)),
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
     * @param   {IDateRange} dateRange
     * @returns {ITableColumn[]}
     */
    private previousYearDatePeriodColumnCompose = (
      dateRange: IDateRange
    ): ITableColumn[] => {
      const PYDateRange = this.getPreviousYearDateRange(
        dateRange.fromDate,
        dateRange.toDate
      );
      return this.getPreviousYearColumns(PYDateRange);
    };

    /**
     * Retrieves previous year date periods columns.
     * @param   {IDateRange} dateRange
     * @returns {ITableColumn[]}
     */
    protected getPreviousYearDatePeriodColumnPlugin = (
      dateRange: IDateRange
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
      return R.pipe(
        // Previous year columns.
        R.append(this.getPreviousYearTotalAccessor()),
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
    ): ITableColumnAccessor[] => {
      return R.pipe(
        // Previous year columns.
        R.append(this.getPreviousYearTotalHorizAccessor(index)),
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
