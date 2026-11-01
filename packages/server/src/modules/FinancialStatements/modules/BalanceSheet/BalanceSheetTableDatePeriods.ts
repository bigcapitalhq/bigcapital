import { flow } from 'fp-ts/function';
import * as A from 'fp-ts/Array';
import { unless } from '@/common/fp';
import { isEmpty } from 'lodash';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import { ITableColumn, ITableColumnAccessor } from '../../types/Table.types';
import { FinancialDatePeriods } from '../../common/FinancialDatePeriods';
import { IDateRange } from '../CashFlowStatement/Cashflow.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BALANCE_SHEET_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export const BalanceSheetTableDatePeriods = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends flow(FinancialDatePeriods)(Base) {
    public i18n: I18nService;
    public query: BalanceSheetQuery;

    protected previousPeriodHorizColumnAccessors: (
      index: number,
    ) => ITableColumnAccessor[];
    protected previousYearHorizontalColumnAccessors: (
      index: number,
    ) => ITableColumnAccessor[];
    public percetangeDatePeriodColumnsAccessor: (
      index: number,
    ) => ITableColumnAccessor[];
    protected previousPeriodHorizontalColumns: (
      dateRange: IDateRange,
    ) => ITableColumn[];
    protected getPreviousYearHorizontalColumns: (
      dateRange: IDateRange,
    ) => ITableColumn[];
    public percentageColumns: () => ITableColumn[];

    /**
     * Retrieves the date periods based on the report query.
     * @returns {IDateRange[]}
     */
    get datePeriods() {
      return this.getDateRanges(
        this.query.fromDate,
        this.query.toDate,
        this.query.displayColumnsBy,
      );
    }

    /**
     * Retrieve the formatted column label from the given date range.
     * @param {ICashFlowDateRange} dateRange -
     * @return {string}
     */
    public formatColumnLabel = (dateRange: IDateRange): string => {
      const monthFormat = (range) => moment(range.toDate).format('YYYY-MM');
      const yearFormat = (range) => moment(range.toDate).format('YYYY');
      const dayFormat = (range) => moment(range.toDate).format('YYYY-MM-DD');

      const conditions: [string, (range) => string][] = [
        ['month', monthFormat],
        ['year', yearFormat],
        ['day', dayFormat],
        ['quarter', monthFormat],
        ['week', dayFormat],
      ];
      for (const [type, formatFn] of conditions) {
        if (this.query.isDisplayColumnsBy(type)) {
          return formatFn(dateRange);
        }
      }
      return undefined;
    };

    // -------------------------
    // # Accessors.
    // -------------------------
    /**
     * Date period columns accessor.
     * @param {IDateRange} dateRange -
     * @param {number} index -
     */
    public datePeriodColumnsAccessor = (
      dateRange: IDateRange,
      index: number,
    ): ITableColumnAccessor[] => {
      return flow(
        (accessors: ITableColumnAccessor[]) => [
          ...this.previousPeriodHorizColumnAccessors(index),
          ...accessors,
        ],
        (accessors: ITableColumnAccessor[]) => [
          ...this.previousYearHorizontalColumnAccessors(index),
          ...accessors,
        ],
        (accessors: ITableColumnAccessor[]) => [
          ...this.percetangeDatePeriodColumnsAccessor(index),
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
    public datePeriodsColumnsAccessors = (): ITableColumnAccessor[] => {
      return A.flatten(
        A.mapWithIndex((index: number, dateRange: IDateRange) =>
          this.datePeriodColumnsAccessor(dateRange, index),
        )(this.datePeriods),
      );
    };

    // -------------------------
    // # Columns.
    // -------------------------
    /**
     *
     * @param {number} index
     * @param {} dateRange
     * @returns {}
     */
    public datePeriodChildrenColumns = (
      index: number,
      dateRange: IDateRange,
    ): ITableColumn[] => {
      return flow(
        (columns: ITableColumn[]) => [
          ...this.previousPeriodHorizontalColumns(dateRange),
          ...columns,
        ],
        (columns: ITableColumn[]) => [
          ...this.getPreviousYearHorizontalColumns(dateRange),
          ...columns,
        ],
        (columns: ITableColumn[]) => [...this.percentageColumns(), ...columns],
        unless(isEmpty, (columns: ITableColumn[]) => [
          {
            key: BALANCE_SHEET_COLUMN_KEYS.TOTAL,
            label: this.i18n.t('balance_sheet.total'),
          },
          ...columns,
        ]),
      )([]);
    };

    /**
     *
     * @param dateRange
     * @param index
     * @returns
     */
    public datePeriodColumn = (
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
    public datePeriodsColumns = (): ITableColumn[] => {
      return this.datePeriods.map(this.datePeriodColumn);
    };
  };
