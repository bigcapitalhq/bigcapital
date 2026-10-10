import { DateInput, type DateInputProps } from '@blueprintjs-formik/datetime';
import moment from 'moment';
import React from 'react';

const DATE_FORMAT = 'YYYY-MM-DD';

// `YYYY-MM-DD`, or that day at UTC midnight: how a server running in UTC
// serializes a DATE column.
const CALENDAR_DATE = /^(\d{4}-\d{2}-\d{2})(?:T00:00:00(?:\.000)?Z)?$/;

/**
 * Parses the field value into the date the picker shows. A calendar date is
 * read as local midnight of that day: `new Date()` would read it as UTC
 * midnight, which west of UTC is still the previous day.
 * @param {string | Date} value - The field value.
 * @returns {Date | null}
 */
function parseFormDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;

  const calendarDate = CALENDAR_DATE.exec(value);

  return calendarDate
    ? moment(calendarDate[1], DATE_FORMAT).toDate()
    : new Date(value);
}

/**
 * Formats the picked date as its local calendar day. `toISOString()` would
 * write the UTC instant, whose date is a day off whenever the local offset
 * carries it across midnight.
 * @param {Date} date - The picked date.
 * @returns {string}
 */
function formatFormDate(date: Date): string {
  return moment(date).format(DATE_FORMAT);
}

/**
 * Date input Blueprint component bound to Formik. The field value is a
 * `YYYY-MM-DD` calendar date, whatever the browser's timezone.
 * @param {DateInputProps} props - Date input props.
 * @returns {JSX.Element}
 */
export function FDateInput(props: DateInputProps): JSX.Element {
  return (
    <DateInput
      formParseDate={parseFormDate}
      formFormatDate={formatFormDate}
      {...props}
    />
  );
}
