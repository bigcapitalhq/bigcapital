import moment from 'moment';
import { IDateRange, IFinancialDatePeriodsUnit } from '../types/Report.types';
import { Constructor } from '@/common/types/Constructor';

export const FinancialDateRanges = <T extends Constructor>(Base: T) =>
  class extends Base {
    /**
     * Retrieve previous period (PP) date of the given date.
     * @param   {Date} fromDate -
     * @param   {Date} toDate -
     * @param   {IFinancialDatePeriodsUnit} unit -
     * @returns {Date}
     */
    public getPreviousPeriodDate = (
      date: Date,
      value: number = 1,
      unit: IFinancialDatePeriodsUnit = IFinancialDatePeriodsUnit.Day,
    ): Date => {
      return moment(date).subtract(value, unit).toDate();
    };

    /**
     * Retrieves the different
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns
     */
    public getPreviousPeriodDiff = (fromDate: Date, toDate: Date) => {
      return moment(toDate).diff(fromDate, 'days') + 1;
    };

    /**
     * Retrieves the periods period dates.
     * @param {Date} fromDate -
     * @param {Date} toDate -
     */
    public getPreviousPeriodDateRange = (
      fromDate: Date,
      toDate: Date,
      unit: IFinancialDatePeriodsUnit,
      amount: number = 1,
    ): IDateRange => {
      const PPToDate = this.getPreviousPeriodDate(toDate, amount, unit);
      const PPFromDate = this.getPreviousPeriodDate(fromDate, amount, unit);

      return { toDate: PPToDate, fromDate: PPFromDate };
    };

    /**
     * Retrieves the previous period (PP) date range of total column.
     * @param   {Date} fromDate
     * @param   {Date} toDate
     * @returns {IDateRange}
     */
    public getPPTotalDateRange = (fromDate: Date, toDate: Date): IDateRange => {
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
     * @param   {Date} fromDate -
     * @param   {Date} toDate -
     * @param   {IFinancialDatePeriodsUnit}
     * @returns {IDateRange}
     */
    public getPPDatePeriodDateRange = (
      fromDate: Date,
      toDate: Date,
      unit: IFinancialDatePeriodsUnit,
    ): IDateRange => {
      return this.getPreviousPeriodDateRange(fromDate, toDate, unit, 1);
    };

    // ------------------------
    // Previous Year (PY).
    // ------------------------
    /**
     * Retrieve the previous year of the given date.
     * @params  {Date} date
     * @returns {Date}
     */
    getPreviousYearDate = (date: Date) => {
      return moment(date).subtract(1, 'years').toDate();
    };

    /**
     * Retrieves previous year date range.
     * @param   {Date} fromDate
     * @param   {Date} toDate
     * @returns {IDateRange}
     */
    public getPreviousYearDateRange = (
      fromDate: Date,
      toDate: Date,
    ): IDateRange => {
      const PYFromDate = this.getPreviousYearDate(fromDate);
      const PYToDate = this.getPreviousYearDate(toDate);

      return { fromDate: PYFromDate, toDate: PYToDate };
    };
  };
