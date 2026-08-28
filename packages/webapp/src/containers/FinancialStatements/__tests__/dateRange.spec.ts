// @ts-nocheck
import moment from 'moment';
import { inferDateRange, resolveDateRange } from '../dateRange';

const asDay = (date) => moment(date).format('YYYY-MM-DD');
const day = (value) => moment(value, 'YYYY-MM-DD').toDate();

const startOf = (range) => moment().startOf(range).toDate();
const endOf = (range) => moment().endOf(range).toDate();

describe('inferDateRange', () => {
  it('should infer today', () => {
    expect(inferDateRange(startOf('day'), endOf('day'))).toBe('today');
  });

  it('should infer this_week', () => {
    expect(inferDateRange(startOf('week'), endOf('week'))).toBe('this_week');
  });

  it('should infer this_month', () => {
    expect(inferDateRange(startOf('month'), endOf('month'))).toBe('this_month');
  });

  it('should infer this_quarter', () => {
    expect(inferDateRange(startOf('quarter'), endOf('quarter'))).toBe(
      'this_quarter',
    );
  });

  it('should infer this_year', () => {
    expect(inferDateRange(startOf('year'), endOf('year'))).toBe('this_year');
  });

  it('should still infer a preset after a YYYY-MM-DD round-trip', () => {
    // The query string flattens `endOf()`'s 23:59:59.999 to midnight.
    expect(
      inferDateRange(day(asDay(startOf('year'))), day(asDay(endOf('year')))),
    ).toBe('this_year');
  });

  it('should return custom for a range matching no preset', () => {
    expect(inferDateRange(day('2025-01-01'), day('2025-12-31'))).toBe('custom');
  });

  it('should return custom when either date is missing', () => {
    expect(inferDateRange(null, day('2025-12-31'))).toBe('custom');
    expect(inferDateRange(day('2025-01-01'), null)).toBe('custom');
    expect(inferDateRange(undefined, undefined)).toBe('custom');
  });
});

describe('resolveDateRange', () => {
  it('should honour an explicit custom choice even when the dates match a preset', () => {
    // Regression: deriving alone snapped the select back to the matching
    // preset, which made `custom` impossible to select.
    expect(resolveDateRange('custom', startOf('year'), endOf('year'))).toBe(
      'custom',
    );
  });

  it('should prefer the dates over a stale stored preset', () => {
    expect(
      resolveDateRange('this_year', day('2025-01-01'), day('2025-12-31')),
    ).toBe('custom');
  });

  it('should derive when nothing is stored, as after a URL round-trip', () => {
    expect(resolveDateRange(undefined, startOf('year'), endOf('year'))).toBe(
      'this_year',
    );
    expect(
      resolveDateRange(undefined, day('2025-01-01'), day('2025-12-31')),
    ).toBe('custom');
  });

  it('should follow a newly picked preset', () => {
    expect(resolveDateRange('today', startOf('day'), endOf('day'))).toBe(
      'today',
    );
  });
});
