import moment from 'moment';
import { dateRangeOptions } from './constants';
import { parseDateRangeQuery } from '@/utils';

/**
 * The date range options `parseDateRangeQuery` can actually resolve.
 *
 * It throws for any keyword missing from its own lookup, so the options are
 * filtered once here at module load. Otherwise adding an option to
 * `dateRangeOptions` without adding it there would throw during render and
 * blank out every financial report.
 */
const DATE_RANGE_PRESETS = dateRangeOptions
  .map((option) => option.value)
  .filter((value) => value !== 'custom')
  .filter((value) => {
    try {
      parseDateRangeQuery(value);
      return true;
    } catch {
      return false;
    }
  });

const formatDay = (date: Date | string | null | undefined): string | null =>
  date ? moment(date).format('YYYY-MM-DD') : null;

/**
 * Derives the preset whose range matches the given dates, otherwise `custom`.
 *
 * Compared at day granularity so it matches `parseDateRangeQuery`'s `endOf()`
 * timestamps both as generated (23:59:59.999) and after a `YYYY-MM-DD`
 * round-trip through the query string.
 */
export const inferDateRange = (
  fromDate: Date | string | null | undefined,
  toDate: Date | string | null | undefined,
): string => {
  const from = formatDay(fromDate);
  const to = formatDay(toDate);

  if (!from || !to) {
    return 'custom';
  }
  const matched = DATE_RANGE_PRESETS.find((preset) => {
    const range = parseDateRangeQuery(preset);

    return formatDay(range.fromDate) === from && formatDay(range.toDate) === to;
  });
  return matched || 'custom';
};

/**
 * Resolves the option the date range select should display.
 *
 * `custom` is a mode rather than a range, so an explicit `custom` choice is
 * honoured: deriving alone would snap the select back to whichever preset the
 * dates still match, leaving `custom` impossible to select. Any other stored
 * value defers to the dates, because `dateRange` does not survive the round-trip
 * back into the form - `transformToForm()` whitelists form keys against each
 * report's default query and none of them declare it - and because the dates can
 * be edited directly, which leaves a stored preset stale.
 */
export const resolveDateRange = (
  dateRange: string | null | undefined,
  fromDate: Date | string | null | undefined,
  toDate: Date | string | null | undefined,
): string =>
  dateRange === 'custom' ? 'custom' : inferDateRange(fromDate, toDate);
