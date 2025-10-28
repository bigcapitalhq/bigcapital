import * as moment from 'moment';
import { IDateRange, IFinancialDatePeriodsUnit } from '../types/Report.types';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from './FinancialSheet';
import { DateInput } from '@/common/types/Date';

export const FinancialDateRanges = <T extends GConstructor<FinancialSheet>>(
  Base: T,
) =>
  class extends Base {
    /**
     * Retrieve previous period (PP) date of the given date.
     * @param {Date} date - Date.
     * @param {number} value - Value.
     * @param {IFinancialDatePeriodsUnit} unit - Unit of time.
     * @returns {Date}
     */
    public getPreviousPeriodDate = (
      date: DateInput,
      value: number = 1,
      unit: IFinancialDatePeriodsUnit = IFinancialDatePeriodsUnit.Day,
    ): Date => {
      return moment(date).subtract(value, unit).toDate();
    };

    /**
     * Retrieves the different between two dates.
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns {number}
     */
    public getPreviousPeriodDiff = (fromDate: DateInput, toDate: DateInput) => {
      return moment(toDate).diff(fromDate, 'days') + 1;
    };

    /**
     * Retrieves the periods period dates.
     * @param {DateInput} fromDate - From date.
     * @param {DateInput} toDate - To date.
     * @param {IFinancialDatePeriodsUnit} unit - Unit of time.
     * @param {number} amount - Amount of time.
     * @returns {IDateRange}
     */
    public getPreviousPeriodDateRange = (
      fromDate: DateInput,
      toDate: DateInput,
      unit: IFinancialDatePeriodsUnit,
      amount: number = 1,
    ): IDateRange => {
      const PPToDate = this.getPreviousPeriodDate(toDate, amount, unit);
      const PPFromDate = this.getPreviousPeriodDate(fromDate, amount, unit);

      return { toDate: PPToDate, fromDate: PPFromDate };
    };

    /**
     * Retrieves the previous period (PP) date range of total column.
     * @param {DateInput} fromDate - From date.
     * @param {DateInput} toDate - To date.
     * @returns {IDateRange}
     */
    public getPPTotalDateRange = (
      fromDate: DateInput,
      toDate: DateInput,
    ): IDateRange => {
      const unit = this.getPreviousPeriodDiff(fromDate, toDate);

      return this.getPreviousPeriodDateRange(
        fromDate,
        toDate,
        IFinancialDatePeriodsUnit.Day,
        unit,
      );
    };

    /**
     * Retrieves the previous period (PP) date range of date periods columns.
     * @param {Date} fromDate - From date.
     * @param {Date} toDate - To date.
     * @param {IFinancialDatePeriodsUnit} unit - Unit of time.
     * @returns {IDateRange}
     */
    public getPPDatePeriodDateRange = (
      fromDate: DateInput,
      toDate: DateInput,
      unit: IFinancialDatePeriodsUnit,
    ): IDateRange => {
      return this.getPreviousPeriodDateRange(fromDate, toDate, unit, 1);
    };

    // ------------------------
    // Previous Year (PY).
    // ------------------------
    /**
     * Retrieve the previous year of the given date.
     * @param {DateInput} date
     * @returns {Date}
     */
    getPreviousYearDate = (date: DateInput) => {
      return moment(date).subtract(1, 'years').toDate();
    };

    /**
     * Retrieves previous year date range.
     * @param {DateInput} fromDate - From date.
     * @param {DateInput} toDate - To date.
     * @returns {IDateRange}
     */
    public getPreviousYearDateRange = (
      fromDate: DateInput,
      toDate: DateInput,
    ): IDateRange => {
      const PYFromDate = this.getPreviousYearDate(fromDate);
      const PYToDate = this.getPreviousYearDate(toDate);

      return { fromDate: PYFromDate, toDate: PYToDate };
    };
  };
