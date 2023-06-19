import moment from 'moment';
import { ITableColumn, IDateRange, ITableColumnAccessor } from '@/interfaces';

export const FinancialTablePreviousPeriod = (Base) =>
  class extends Base {
    getTotalPreviousPeriod = () => {
      return this.query.PPToDate;
    };
    // ----------------------------
    // # Columns
    // ----------------------------
    /**
     * Retrieve previous period total column.
     * @param   {IDateRange} dateRange -
     * @returns {ITableColumn}
     */
    protected getPreviousPeriodTotalColumn = (
      dateRange?: IDateRange
    ): ITableColumn => {
      const PPDate = dateRange
        ? dateRange.toDate
        : this.getTotalPreviousPeriod();
      const PPFormatted = moment(PPDate).format('YYYY-MM-DD');

      return {
        key: 'previous_period',
        label: this.i18n.__(`financial_sheet.previous_period_date`, {
          date: PPFormatted,
        }),
      };
    };

    /**
     * Retrieve previous period change column.
     * @returns {ITableColumn}
     */
    protected getPreviousPeriodChangeColumn = (): ITableColumn => {
      return {
        key: 'previous_period_change',
        label: this.i18n.__('financial_sheet.previous_period_change'),
      };
    };

    /**
     * Retrieve previous period percentage column.
     * @returns {ITableColumn}
     */
    protected getPreviousPeriodPercentageColumn = (): ITableColumn => {
      return {
        key: 'previous_period_percentage',
        label: this.i18n.__('financial_sheet.previous_period_percentage'),
      };
    };

    /**
     * Retrieves previous period total accessor.
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousPeriodTotalAccessor = (): ITableColumnAccessor => {
      return {
        key: 'previous_period',
        accessor: 'previousPeriod.formattedAmount',
      };
    };

    /**
     * Retrieves previous period change accessor.
     * @returns
     */
    protected getPreviousPeriodChangeAccessor = () => {
      return {
        key: 'previous_period_change',
        accessor: 'previousPeriodChange.formattedAmount',
      };
    };

    /**
     * Retrieves previous period percentage accessor.
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousPeriodPercentageAccessor =
      (): ITableColumnAccessor => {
        return {
          key: 'previous_period_percentage',
          accessor: 'previousPeriodPercentage.formattedAmount',
        };
      };

    /**
     * Retrieves previous period total horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousPeriodTotalHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_period',
        accessor: `horizontalTotals[${index}].previousPeriod.formattedAmount`,
      };
    };

    /**
     * Retrieves previous period change horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousPeriodChangeHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_period_change',
        accessor: `horizontalTotals[${index}].previousPeriodChange.formattedAmount`,
      };
    };

    /**
     * Retrieves pervious period percentage horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousPeriodPercentageHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_period_percentage',
        accessor: `horizontalTotals[${index}].previousPeriodPercentage.formattedAmount`,
      };
    };
  };
