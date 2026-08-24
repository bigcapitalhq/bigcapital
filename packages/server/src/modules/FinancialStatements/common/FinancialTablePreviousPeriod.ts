// @ts-nocheck
import * as moment from 'moment';
import { ITableColumn, ITableColumnAccessor } from '../types/Table.types';
import { IDateRange } from '../types/Report.types';
import { GConstructor } from '@/common/types/Constructor';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheet } from './FinancialSheet';
import { COMPARISON_COLUMN_KEYS } from './constants/tableColumnKeys';

export const FinancialTablePreviousPeriod = <
  T extends GConstructor<FinancialSheet>,
>(
  Base: T,
) =>
  class extends Base {
    public readonly i18n: I18nService;

    getTotalPreviousPeriod = () => {
      return this.query.PPToDate;
    };
    // ----------------------------
    // # Columns
    // ----------------------------
    /**
     * Retrive previous period total column.
     * @param   {IDateRange} dateRange -
     * @returns {ITableColumn}
     */
    public getPreviousPeriodTotalColumn = (
      dateRange?: IDateRange,
    ): ITableColumn => {
      const PPDate = dateRange
        ? dateRange.toDate
        : this.getTotalPreviousPeriod();
      const PPFormatted = moment(PPDate).format('YYYY-MM-DD');

      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD,
        label: this.i18n.t(`financial_sheet.previoud_period_date`, {
          args: { date: PPFormatted },
        }),
      };
    };

    /**
     * Retrieve previous period change column.
     * @returns {ITableColumn}
     */
    public getPreviousPeriodChangeColumn = (): ITableColumn => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_CHANGE,
        label: this.i18n.t('financial_sheet.previous_period_change'),
      };
    };

    /**
     * Retrieve previous period percentage column.
     * @returns {ITableColumn}
     */
    public getPreviousPeriodPercentageColumn = (): ITableColumn => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_PERCENTAGE,
        label: this.i18n.t('financial_sheet.previous_period_percentage'),
      };
    };

    /**
     * Retrieves previous period total accessor.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousPeriodTotalAccessor = (): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD,
        accessor: 'previousPeriod.formattedAmount',
      };
    };

    /**
     * Retrieves previous period change accessor.
     * @returns
     */
    public getPreviousPeriodChangeAccessor = () => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_CHANGE,
        accessor: 'previousPeriodChange.formattedAmount',
      };
    };

    /**
     * Retrieves previous period percentage accessor.
     * @returns {ITableColumnAccessor}
     */
    public getPreviousPeriodPercentageAccessor = (): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_PERCENTAGE,
        accessor: 'previousPeriodPercentage.formattedAmount',
      };
    };

    /**
     * Retrieves previous period total horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    public getPreviousPeriodTotalHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD,
        accessor: `horizontalTotals[${index}].previousPeriod.formattedAmount`,
      };
    };

    /**
     * Retrieves previous period change horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    public getPreviousPeriodChangeHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_CHANGE,
        accessor: `horizontalTotals[${index}].previousPeriodChange.formattedAmount`,
      };
    };

    /**
     * Retrieves pervious period percentage horizontal column accessor.
     * @param   {number} index
     * @returns {ITableColumnAccessor}
     */
    public getPreviousPeriodPercentageHorizAccessor = (
      index: number,
    ): ITableColumnAccessor => {
      return {
        key: COMPARISON_COLUMN_KEYS.PREVIOUS_PERIOD_PERCENTAGE,
        accessor: `horizontalTotals[${index}].previousPeriodPercentage.formattedAmount`,
      };
    };
  };
