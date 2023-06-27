import * as R from 'ramda';
import moment from 'moment';
import {
  ITableColumn,
  IDateRange,
  ICashFlowDateRange,
  ITableColumnAccessor,
} from '@/interfaces';
import { FinancialDatePeriods } from '../FinancialDatePeriods';

export const BalanceSheetTableDatePeriods = (Base) =>
  class extends R.compose(FinancialDatePeriods)(Base) {
    /**
     * Retrieves the date periods based on the report query.
     * @returns {IDateRange[]}
     */
    get datePeriods() {
      return this.getDateRanges(
        this.query.fromDate,
        this.query.toDate,
        this.query.displayColumnsBy
      );
    }

    /**
     * Retrieve the formatted column label from the given date range.
     * @param {ICashFlowDateRange} dateRange -
     * @return {string}
     */
    private formatColumnLabel = (dateRange: ICashFlowDateRange) => {
      const monthFormat = (range) => moment(range.toDate).format('YYYY-MM');
      const yearFormat = (range) => moment(range.toDate).format('YYYY');
      const dayFormat = (range) => moment(range.toDate).format('YYYY-MM-DD');

      const conditions = [
        ['month', monthFormat],
        ['year', yearFormat],
        ['day', dayFormat],
        ['quarter', monthFormat],
        ['week', dayFormat],
      ];
      const conditionsPairs = R.map(
        ([type, formatFn]) => [
          R.always(this.query.isDisplayColumnsBy(type)),
          formatFn,
        ],
        conditions
      );
      return R.compose(R.cond(conditionsPairs))(dateRange);
    };

    // -------------------------
    // # Accessors.
    // -------------------------
    /**
     * Date period columns accessor.
     * @param {IDateRange} dateRange -
     * @param {number} index -
     */
    private datePeriodColumnsAccessor = R.curry(
      (dateRange: IDateRange, index: number) => {
        return R.pipe(
          R.concat(this.previousPeriodHorizColumnAccessors(index)),
          R.concat(this.previousYearHorizontalColumnAccessors(index)),
          R.concat(this.percentageDatePeriodColumnsAccessor(index)),
          R.concat([
            {
              key: `date-range-${index}`,
              accessor: `horizontalTotals[${index}].total.formattedAmount`,
            },
          ])
        )([]);
      }
    );

    /**
     * Retrieve the date periods columns accessors.
     * @returns {ITableColumnAccessor[]}
     */
    protected datePeriodsColumnsAccessors = (): ITableColumnAccessor[] => {
      return R.compose(
        R.flatten,
        R.addIndex(R.map)(this.datePeriodColumnsAccessor)
      )(this.datePeriods);
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
    private datePeriodChildrenColumns = (
      index: number,
      dateRange: IDateRange
    ) => {
      return R.compose(
        R.unless(
          R.isEmpty,
          R.concat([
            { key: `total`, label: this.i18n.__('balance_sheet.total') },
          ])
        ),
        R.concat(this.percentageColumns()),
        R.concat(this.getPreviousYearHorizontalColumns(dateRange)),
        R.concat(this.previousPeriodHorizontalColumns(dateRange))
      )([]);
    };

    /**
     *
     * @param dateRange
     * @param index
     * @returns
     */
    private datePeriodColumn = (
      dateRange: IDateRange,
      index: number
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
