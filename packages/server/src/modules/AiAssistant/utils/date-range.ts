import * as moment from 'moment';

export interface IDateRange {
  fromDate: string;
  toDate: string;
}

const DATE_FORMAT = 'YYYY-MM-DD';

const parseDate = (value: string, field: string): moment.Moment => {
  const parsed = moment(value, DATE_FORMAT, true);
  if (!parsed.isValid()) {
    throw new Error(`${field} must be a valid date in YYYY-MM-DD format.`);
  }
  return parsed;
};

/**
 * Resolves an optional tool date range.
 *
 * Defaults to the current calendar year to date. End dates are inclusive.
 */
export const resolveDateRange = (
  fromDate?: string,
  toDate?: string,
): IDateRange => {
  const today = moment().startOf('day');
  const to = toDate ? parseDate(toDate, 'toDate') : today;
  const from = fromDate
    ? parseDate(fromDate, 'fromDate')
    : to.clone().startOf('year');

  if (from.isAfter(to)) {
    return {
      fromDate: to.format(DATE_FORMAT),
      toDate: from.format(DATE_FORMAT),
    };
  }
  return {
    fromDate: from.format(DATE_FORMAT),
    toDate: to.format(DATE_FORMAT),
  };
};
