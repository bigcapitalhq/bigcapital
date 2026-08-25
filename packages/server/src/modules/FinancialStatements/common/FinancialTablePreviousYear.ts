// @ts-nocheck
import * as moment from 'moment';
import { ITableColumn, ITableColumnAccessor } from '../types/Table.types';
import { IDateRange } from '../types/Report.types';
import { GConstructor } from '@/common/types/Constructor';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheet } from './FinancialSheet';
import { COMPARISON_COLUMN_KEYS } from './constants/tableColumnKeys';

export const FinancialTablePreviousYear = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends Base {
    public readonly i18n: I18nService;

    /**
     * Retrieves the total previous year date.
     * @returns {Date}
     */
    public getTotalPreviousYear = () => {
      return this.query.PYToDate;
    };

    // ------------------------------------
    // # Columns.
    // ------------------------------------
    /**
     * Retrive previous year total column.
     * @param {DateRange} previousYear -
     * @returns {ITableColumn}
     */
    public getPreviousYearTotalColumn = (
      dateRange?: IDateRange,
    ): ITableColumn => {
      const PYDate = dateRange ? dateRange.toDate : this.getTotalPreviousYear();
      const PYFormatted = moment(PYDate).format('YYYY-MM-DD');

      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR,
        label: this.i18n.t('financial_sheet.previous_year_date', {
          args: { date: PYFormatted },
        }),
      };
    };

    /**
     * Retrieve previous year change column.
     * @returns {ITableColumn}
     */
    public getPreviousYearChangeColumn = (): ITableColumn => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_CHANGE,
        label: this.i18n.t('financial_sheet.previous_year_change'),
      };
    };

    /**
     * Retrieve previous year percentage column.
     * @returns {ITableColumn}
     */
    public getPreviousYearPercentageColumn = (): ITableColumn => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_PERCENTAGE,
        label: this.i18n.t('financial_sheet.previous_year_percentage'),
      };
    };

    // ------------------------------------
    // # Accessors.
    // ------------------------------------
    /**
     * Retrieves previous year total column accessor.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearTotalAccessor = (): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR,
        accessor: 'previousYear.formattedAmount',
      };
    };

    /**
     * Retrieves previous year change column accessor.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearChangeAccessor = (): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_CHANGE,
        accessor: 'previousYearChange.formattedAmount',
      };
    };

    /**
     * Retrieves previous year percentage column accessor.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearPercentageAccessor = (): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_PERCENTAGE,
        accessor: 'previousYearPercentage.formattedAmount',
      };
    };

    /**
     * Retrieves previous year total horizontal column accessor.
     * @param {number} index - Index.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearTotalHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR,
        accessor: `horizontalTotals[${index}].previousYear.formattedAmount`,
      };
    };

    /**
     * Retrieves previous previous year change horizontal column accessor.
     * @param {number} index
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearChangeHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_CHANGE,
        accessor: `horizontalTotals[${index}].previousYearChange.formattedAmount`,
      };
    };

    /**
     * Retrieves previous year percentage horizontal column accessor.
     * @param {number} index
     * @returns {ITableColumnAccessor}
     */
    public getPreviousYearPercentageHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_YEAR_PERCENTAGE,
        accessor: `horizontalTotals[${index}].previousYearPercentage.formattedAmount`,
      };
    };
  };
