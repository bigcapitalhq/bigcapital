import * as R from 'ramda';
import { memoize } from 'lodash';
import { compose } from 'lodash/fp';
import {
  IAccountTransactionsGroupBy,
  IFinancialDatePeriodsUnit,
  IFinancialSheetTotalPeriod,
  IFormatNumberSettings,
} from '@/interfaces';
import { dateRangeFromToCollection } from 'utils';
import { FinancialDateRanges } from './FinancialDateRanges';

export const FinancialDatePeriods = (Base) =>
  class extends compose(FinancialDateRanges)(Base) {
    /**
     *
     * @param {Date} fromDate -
     * @param {Date} toDate
     * @param {string} unit
     */
    protected getDateRanges = memoize(
      (fromDate: Date, toDate: Date, unit: string) => {
        return dateRangeFromToCollection(fromDate, toDate, unit);
      }
    );

    /**
     * Retrieve the date period meta.
     * @param  {number} total - Total amount.
     * @param  {Date} fromDate - From date.
     * @param  {Date} toDate -  To date.
     * @return {ICashFlowDatePeriod}
     */
    protected getDatePeriodMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings?: IFormatNumberSettings
    ): IFinancialSheetTotalPeriod => {
      return {
        fromDate: this.getDateMeta(fromDate),
        toDate: this.getDateMeta(toDate),
        total: this.getAmountMeta(total, overrideSettings),
      };
    };

    /**
     * Retrieve the date period meta.
     * @param  {number} total - Total amount.
     * @param  {Date} fromDate - From date.
     * @param  {Date} toDate -  To date.
     * @return {ICashFlowDatePeriod}
     */
    protected getDatePeriodTotalMeta = (
      total: number,
      fromDate: Date,
      toDate: Date,
      overrideSettings: IFormatNumberSettings = {}
    ) => {
      return this.getDatePeriodMeta(total, fromDate, toDate, {
        money: true,
        ...overrideSettings,
      });
    };

    /**
     * Retrieve the date preioods of the given node and accumulated function.
     * @param  {IBalanceSheetAccountNode} node
     * @param  {(fromDate: Date, toDate: Date, index: number) => any}
     * @return {}
     */
    protected getNodeDatePeriods = R.curry(
      (
        fromDate: Date,
        toDate: Date,
        periodsUnit: string,
        node: any,
        callback: (
          node: any,
          fromDate: Date,
          toDate: Date,
          index: number
        ) => any
      ) => {
        const curriedCallback = R.curry(callback)(node);

        // Retrieves memorized date ranges.
        const dateRanges = this.getDateRanges(fromDate, toDate, periodsUnit);

        return dateRanges.map((dateRange, index) => {
          return curriedCallback(dateRange.fromDate, dateRange.toDate, index);
        });
      }
    );

    /**
     * Retrieve the accounts transactions group type from display columns by.
     * @param   {IAccountTransactionsGroupBy} columnsBy
     * @returns {IAccountTransactionsGroupBy}
     */
    protected getGroupByFromDisplayColumnsBy = (
      columnsBy: IFinancialDatePeriodsUnit
    ): IAccountTransactionsGroupBy => {
      const paris = {
        week: IAccountTransactionsGroupBy.Day,
        quarter: IAccountTransactionsGroupBy.Month,
        year: IAccountTransactionsGroupBy.Year,
        month: IAccountTransactionsGroupBy.Month,
        day: IAccountTransactionsGroupBy.Day,
      };
      return paris[columnsBy];
    };
  };
