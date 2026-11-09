import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import * as moment from 'moment';
import { isEmpty } from 'lodash';
import { unless, when } from '@/common/fp';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { ProfitLossSheetTablePercentage } from './ProfitLossSheetTablePercentage';
import { ProfitLossTablePreviousPeriod } from './ProfitLossTablePreviousPeriod';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { IDateRange } from '../../types/Report.types';
import { PROFIT_LOSS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export const ProfitLossSheetTableDatePeriods = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(
    ProfitLossSheetTablePercentage,
    ProfitLossTablePreviousPeriod,
    FinancialDatePeriods,
  )(Base) {
    protected getPreviousYearDatePeriodColumnPlugin: (
      dateRange: IDateRange,
    ) => ITableColumn[];
    protected previousYearHorizontalColumnAccessors: (
      index: number,
    ) => ITableColumnAccessor[];

    /**
     * Retrieves the date periods based on the report query.
     * @returns {IDateRange[]}
     */
    get datePeriods() {
      return this.getDateRanges(
        this.query.query.fromDate as Date,
        this.query.query.toDate as Date,
        this.query.query.displayColumnsBy as moment.unitOfTime.StartOf,
      );
    }

    // --------------------------------
    // # Accessors
    // --------------------------------
    /**
     * Date period columns accessor.
     * @param {IDateRange} dateRange -
     * @param {number} index -
     */
    private datePeriodColumnsAccessor = (
      dateRange: IDateRange,
      index: number,
    ) => {
      return flow(
        when(
          this.query.isPreviousPeriodActive,
          (accessors: ITableColumnAccessor[]) => [
            ...this.previousPeriodHorizontalColumnAccessors(index),
            ...accessors,
          ],
        ),
        when(
          this.query.isPreviousYearActive,
          (accessors: ITableColumnAccessor[]) => [
            ...this.previousYearHorizontalColumnAccessors(index),
            ...accessors,
          ],
        ),
        (accessors: ITableColumnAccessor[]) => [
          ...this.percetangeHorizontalColumnsAccessor(index),
          ...accessors,
        ],
        (accessors: ITableColumnAccessor[]) => [
          {
            key: `date-range-${index}`,
            accessor: `horizontalTotals[${index}].total.formattedAmount`,
          },
          ...accessors,
        ],
      )([]);
    };

    /**
     * Retrieve the date periods columns accessors.
     * @returns {ITableColumnAccessor[]}
     */
    protected datePeriodsColumnsAccessors = (): ITableColumnAccessor[] => {
      return A.flatten(
        A.mapWithIndex((index: number, dateRange: IDateRange) =>
          this.datePeriodColumnsAccessor(dateRange, index),
        )(this.datePeriods),
      );
    };

    // --------------------------------
    // # Columns
    // --------------------------------
    /**
     * Retrieve the formatted column label from the given date range.
     * @param {ICashFlowDateRange} dateRange -
     * @return {string}
     */
    private formatColumnLabel = (dateRange) => {
      const monthFormat = (range) => moment(range.toDate).format('YYYY-MM');
      const yearFormat = (range) => moment(range.toDate).format('YYYY');
      const dayFormat = (range) => moment(range.toDate).format('YYYY-MM-DD');

      if (this.query.isDisplayColumnsBy('month')) {
        return monthFormat(dateRange);
      }
      if (this.query.isDisplayColumnsBy('year')) {
        return yearFormat(dateRange);
      }
      if (this.query.isDisplayColumnsBy('day')) {
        return dayFormat(dateRange);
      }
      if (this.query.isDisplayColumnsBy('quarter')) {
        return monthFormat(dateRange);
      }
      if (this.query.isDisplayColumnsBy('week')) {
        return dayFormat(dateRange);
      }
      return undefined;
    };

    /**
     *
     * @param   {number} index
     * @param   {IDateRange} dateRange
     * @returns {}
     */
    private datePeriodChildrenColumns = (
      index: number,
      dateRange: IDateRange,
    ) => {
      return flow(
        when(this.query.isPreviousPeriodActive, (columns: ITableColumn[]) => [
          ...this.getPreviousPeriodDatePeriodsPlugin(dateRange),
          ...columns,
        ]),
        when(this.query.isPreviousYearActive, (columns: ITableColumn[]) => [
          ...this.getPreviousYearDatePeriodColumnPlugin(dateRange),
          ...columns,
        ]),
        (columns: ITableColumn[]) => [...this.percentageColumns(), ...columns],
        unless(isEmpty, (columns: ITableColumn[]) => [
          {
            key: PROFIT_LOSS_COLUMN_KEYS.TOTAL,
            label: this.i18n.t('profit_loss_sheet.total'),
          },
          ...columns,
        ]),
      )([]);
    };

    /**
     *
     * @param   {IDateRange} dateRange
     * @param   {number} index
     * @returns {ITableColumn}
     */
    private datePeriodColumn = (
      dateRange: IDateRange,
      index: number,
    ): ITableColumn => {
      return {
        key: `date-range-${index}`,
        label: this.formatColumnLabel(dateRange),
        children: this.datePeriodChildrenColumns(index, dateRange),
      };
    };

    /**
     * Date periods columns.
     * @returns {ITableColumn[]}
     */
    protected datePeriodsColumns = (): ITableColumn[] => {
      return this.datePeriods.map(this.datePeriodColumn);
    };
  };
