import * as moment from 'moment';
import 'moment-timezone';

export const RECURRENCE_DATE_FORMAT = 'YYYY-MM-DD';

export enum RecurrenceFrequency {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

/**
 * Returns today's date in the organization timezone.
 * @param {string} timezone - IANA timezone.
 * @returns {string}
 */
export function getTodayDate(timezone?: string): string {
  if (timezone) {
    return moment.tz(timezone).format(RECURRENCE_DATE_FORMAT);
  }
  return moment().format(RECURRENCE_DATE_FORMAT);
}

/**
 * Adds one recurrence interval to the given date.
 *
 * Month/year recurrences are anchored to the start date so that a profile
 * starting on the 31st keeps billing on the last day of shorter months and
 * returns to the 31st when the month has one.
 *
 * @param {string} currentDate - Current occurrence date.
 * @param {string} startDate - Profile start date (anchor).
 * @param {RecurrenceFrequency} frequency - Recurrence frequency.
 * @param {number} interval - Recurrence interval.
 * @returns {string}
 */
export function addOccurrence(
  currentDate: string,
  startDate: string,
  frequency: RecurrenceFrequency,
  interval: number,
): string {
  const current = moment(currentDate, RECURRENCE_DATE_FORMAT);
  const anchor = moment(startDate, RECURRENCE_DATE_FORMAT);
  const safeInterval = Math.max(Number(interval) || 1, 1);

  switch (frequency) {
    case RecurrenceFrequency.Day:
      return current.add(safeInterval, 'day').format(RECURRENCE_DATE_FORMAT);

    case RecurrenceFrequency.Week:
      return current.add(safeInterval, 'week').format(RECURRENCE_DATE_FORMAT);

    case RecurrenceFrequency.Month: {
      const target = current
        .clone()
        .startOf('month')
        .add(safeInterval, 'month');
      const day = Math.min(anchor.date(), target.daysInMonth());

      return target.date(day).format(RECURRENCE_DATE_FORMAT);
    }

    case RecurrenceFrequency.Year: {
      const target = current
        .clone()
        .startOf('year')
        .add(safeInterval, 'year')
        .month(anchor.month());
      const day = Math.min(anchor.date(), target.daysInMonth());

      return target.date(day).format(RECURRENCE_DATE_FORMAT);
    }

    default:
      return current.add(safeInterval, 'day').format(RECURRENCE_DATE_FORMAT);
  }
}

/**
 * Retrieves the first occurrence on or after the given date.
 * @param {string} startDate - Profile start date.
 * @param {string} fromDate - Lower bound date (typically today).
 * @param {RecurrenceFrequency} frequency - Recurrence frequency.
 * @param {number} interval - Recurrence interval.
 * @param {string} [endDate] - Optional end date.
 * @returns {string | null}
 */
export function getFirstOccurrenceOnOrAfter(
  startDate: string,
  fromDate: string,
  frequency: RecurrenceFrequency,
  interval: number,
  endDate?: string | null,
): string | null {
  let occurrence = moment(startDate, RECURRENCE_DATE_FORMAT).format(
    RECURRENCE_DATE_FORMAT,
  );

  if (endDate && occurrence > endDate) {
    return null;
  }

  if (occurrence >= fromDate) {
    return occurrence;
  }

  // Guard against malformed data causing an infinite loop.
  for (let index = 0; index < 10000; index++) {
    occurrence = addOccurrence(occurrence, startDate, frequency, interval);

    if (endDate && occurrence > endDate) {
      return null;
    }
    if (occurrence >= fromDate) {
      return occurrence;
    }
  }

  return null;
}

/**
 * Determines whether the schedule exhausted its end date / max occurrences.
 * @param {Object} schedule
 * @returns {boolean}
 */
export function isScheduleExhausted(schedule: {
  endDate?: string | null;
  maxOccurrences?: number | null;
  occurrencesCount: number;
  nextInvoiceDate?: string | null;
}): boolean {
  if (
    schedule.maxOccurrences != null &&
    schedule.occurrencesCount >= schedule.maxOccurrences
  ) {
    return true;
  }
  if (
    schedule.endDate &&
    schedule.nextInvoiceDate &&
    schedule.nextInvoiceDate > schedule.endDate
  ) {
    return true;
  }
  return false;
}
