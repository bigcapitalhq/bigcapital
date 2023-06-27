import moment from 'moment';
import { IDateRange, ITableColumn, ITableColumnAccessor } from '@/interfaces';

export const FinancialTablePreviousYear = (Base) =>
  class extends Base {
    getTotalPreviousYear = () => {
      return this.query.PYToDate;
    };
    // ------------------------------------
    // # Columns.
    // ------------------------------------
    /**
     * Retrieve previous year total column.
     * @param   {DateRange} previousYear -
     * @returns {ITableColumn}
     */
    protected getPreviousYearTotalColumn = (
      dateRange?: IDateRange
    ): ITableColumn => {
      const PYDate = dateRange ? dateRange.toDate : this.getTotalPreviousYear();
      const PYFormatted = moment(PYDate).format('YYYY-MM-DD');

      return {
        key: 'previous_year',
        label: this.i18n.__('financial_sheet.previous_year_date', {
          date: PYFormatted,
        }),
      };
    };

    /**
     * Retrieve previous year change column.
     * @returns {ITableColumn}
     */
    protected getPreviousYearChangeColumn = (): ITableColumn => {
      return {
        key: 'previous_year_change',
        label: this.i18n.__('financial_sheet.previous_year_change'),
      };
    };

    /**
     * Retrieve previous year percentage column.
     * @returns {ITableColumn}
     */
    protected getPreviousYearPercentageColumn = (): ITableColumn => {
      return {
        key: 'previous_year_percentage',
        label: this.i18n.__('financial_sheet.previous_year_percentage'),
      };
    };

    // ------------------------------------
    // # Accessors.
    // ------------------------------------
    /**
     * Retrieves previous year total column accessor.
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearTotalAccessor = (): ITableColumnAccessor => {
      return {
        key: 'previous_year',
        accessor: 'previousYear.formattedAmount',
      };
    };

    /**
     * Retrieves previous year change column accessor.
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearChangeAccessor = (): ITableColumnAccessor => {
      return {
        key: 'previous_year_change',
        accessor: 'previousYearChange.formattedAmount',
      };
    };

    /**
     * Retrieves previous year percentage column accessor.
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearPercentageAccessor = (): ITableColumnAccessor => {
      return {
        key: 'previous_year_percentage',
        accessor: 'previousYearPercentage.formattedAmount',
      };
    };

    /**
     * Retrieves previous year total horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearTotalHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_year',
        accessor: `horizontalTotals[${index}].previousYear.formattedAmount`,
      };
    };

    /**
     * Retrieves previous year change horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearChangeHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_year_change',
        accessor: `horizontalTotals[${index}].previousYearChange.formattedAmount`,
      };
    };

    /**
     * Retrieves previous year percentage horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    protected getPreviousYearPercentageHorizAccessor = (
      index: number
    ): ITableColumnAccessor => {
      return {
        key: 'previous_year_percentage',
        accessor: `horizontalTotals[${index}].previousYearPercentage.formattedAmount`,
      };
    };
  };
