import { IDateRange, IFinancialDatePeriodsUnit } from '@/interfaces';
import moment from 'moment';

export const FinancialDateRanges = (Base) =>
  class extends Base {
    /**
     * Retrieve previous period (PP) date of the given date.
     * @param   {Date} fromDate -
     * @param   {Date} toDate -
     * @param   {IFinancialDatePeriodsUnit} unit -
     * @returns {Date}
     */
    protected getPreviousPeriodDate = (
      date: Date,
      value: number = 1,
      unit: IFinancialDatePeriodsUnit = IFinancialDatePeriodsUnit.Day
    ): Date => {
      return moment(date).subtract(value, unit).toDate();
    };

    /**
     * Retrieves the different 
     * @param {Date} fromDate
     * @param {Date} toDate
     * @returns
     */
    protected getPreviousPeriodDiff = (fromDate: Date, toDate: Date) => {
      return moment(toDate).diff(fromDate, 'days') + 1;
    };

    /**
     * Retrieves the periods period dates.
     * @param {Date} fromDate -
     * @param {Date} toDate -
     */
    protected getPreviousPeriodDateRange = (
      fromDate: Date,
      toDate: Date,
      unit: IFinancialDatePeriodsUnit,
      amount: number = 1
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
    protected getPPTotalDateRange = (
      fromDate: Date,
      toDate: Date
    ): IDateRange => {
      const unit = this.getPreviousPeriodDiff(fromDate, toDate);

      return this.getPreviousPeriodDateRange(
        fromDate,
        toDate,
        IFinancialDatePeriodsUnit.Day,
        unit
      );
    };

    /**
     * Retrieves the previous period (PP) date range of date periods columns.
     * @param   {Date} fromDate -
     * @param   {Date} toDate -
     * @param   {IFinancialDatePeriodsUnit}
     * @returns {IDateRange}
     */
    protected getPPDatePeriodDateRange = (
      fromDate: Date,
      toDate: Date,
      unit: IFinancialDatePeriodsUnit
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
    protected getPreviousYearDateRange = (
      fromDate: Date,
      toDate: Date
    ): IDateRange => {
      const PYFromDate = this.getPreviousYearDate(fromDate);
      const PYToDate = this.getPreviousYearDate(toDate);

      return { fromDate: PYFromDate, toDate: PYToDate };
    };
  };
