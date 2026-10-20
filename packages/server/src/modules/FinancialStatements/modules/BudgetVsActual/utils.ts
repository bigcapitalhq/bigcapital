import * as moment from 'moment';
import { merge } from 'lodash';
import { INumberFormatQuery } from '../../types/Report.types';
import {
  BudgetVsActualDisplayColumnsBy,
  IBudgetVsActualQuery,
} from './BudgetVsActual.types';

/**
 * Default number format settings of the report.
 * @returns {INumberFormatQuery}
 */
export const getDefaultNumberFormat = (): INumberFormatQuery => ({
  divideOn1000: false,
  negativeFormat: 'mines',
  showZero: false,
  formatMoney: 'total',
  precision: 2,
});

/**
 * Default budget vs actual query.
 * @returns {Partial<IBudgetVsActualQuery>}
 */
export const getDefaultBudgetVsActualQuery = () => ({
  displayColumnsBy: 'month' as BudgetVsActualDisplayColumnsBy,
  numberFormat: getDefaultNumberFormat(),
  branchesIds: [],
  accountsIds: [],
});

/**
 * Merges the given query with the default query.
 * @param {IBudgetVsActualQuery} query
 * @returns {IBudgetVsActualQuery}
 */
export const mergeQueryWithDefaults = (
  query: IBudgetVsActualQuery,
): IBudgetVsActualQuery => {
  return merge(getDefaultBudgetVsActualQuery(), query);
};

/**
 * Retrieves the period key of the given date based on the display columns type.
 * @param {moment.MomentInput} date
 * @param {BudgetVsActualDisplayColumnsBy} displayColumnsBy
 * @returns {string}
 */
export const getPeriodKey = (
  date: moment.MomentInput,
  displayColumnsBy: BudgetVsActualDisplayColumnsBy,
): string => {
  const momentDate = moment(date);

  switch (displayColumnsBy) {
    case 'year':
      return momentDate.format('YYYY');
    case 'quarter':
      return `${momentDate.format('YYYY')}-Q${momentDate.quarter()}`;
    case 'month':
    default:
      return momentDate.format('YYYY-MM');
  }
};

/**
 * Retrieves the period formatted label of the given date.
 * @param {moment.MomentInput} date
 * @param {BudgetVsActualDisplayColumnsBy} displayColumnsBy
 * @returns {string}
 */
export const getPeriodLabel = (
  date: moment.MomentInput,
  displayColumnsBy: BudgetVsActualDisplayColumnsBy,
): string => {
  const momentDate = moment(date);

  switch (displayColumnsBy) {
    case 'year':
      return momentDate.format('YYYY');
    case 'quarter':
      return `Q${momentDate.quarter()} ${momentDate.format('YYYY')}`;
    case 'month':
    default:
      return momentDate.format('MMM YYYY');
  }
};

/**
 * Retrieves the months keys (YYYY-MM) of the given date range.
 * @param {moment.MomentInput} fromDate
 * @param {moment.MomentInput} toDate
 * @returns {string[]}
 */
export const getMonthsKeys = (
  fromDate: moment.MomentInput,
  toDate: moment.MomentInput,
): string[] => {
  const months: string[] = [];
  const cursor = moment(fromDate).startOf('month');
  const lastDate = moment(toDate).endOf('month');

  while (cursor.isSameOrBefore(lastDate, 'month')) {
    months.push(cursor.format('YYYY-MM'));
    cursor.add(1, 'month');
  }
  return months;
};
