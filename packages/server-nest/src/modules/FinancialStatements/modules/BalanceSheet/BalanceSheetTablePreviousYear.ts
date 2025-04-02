// @ts-nocheck
import * as R from 'ramda';
import { IDateRange } from '../../types/Report.types';
import { ITableColumn } from '../../types/Table.types';
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
  class extends R.pipe(FinancialTablePreviousYear, FinancialDateRanges)(Base) {
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
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalColumn(dateRange)),
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeColumn()),
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageColumn()),
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
    public previousYearColumnAccessor = (): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalAccessor()),
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeAccessor()),
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageAccessor()),
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
    ): ITableColumn[] => {
      return R.pipe(
        // Previous year columns.
        R.when(
          this.query.isPreviousYearActive,
          R.append(this.getPreviousYearTotalHorizAccessor(index)),
        ),
        R.when(
          this.query.isPreviousYearChangeActive,
          R.append(this.getPreviousYearChangeHorizAccessor(index)),
        ),
        R.when(
          this.query.isPreviousYearPercentageActive,
          R.append(this.getPreviousYearPercentageHorizAccessor(index)),
        ),
      )([]);
    };
  };
