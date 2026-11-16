import * as moment from 'moment';
import { resolveDateRange } from './date-range';

describe('resolveDateRange', () => {
  it('defaults to the current calendar year to date', () => {
    const range = resolveDateRange();
    const today = moment();

    expect(range.fromDate).toBe(
      today.clone().startOf('year').format('YYYY-MM-DD'),
    );
    expect(range.toDate).toBe(today.format('YYYY-MM-DD'));
  });

  it('uses explicit inclusive dates', () => {
    expect(resolveDateRange('2026-01-01', '2026-03-31')).toEqual({
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
    });
  });

  it('swaps a reversed range', () => {
    expect(resolveDateRange('2026-03-31', '2026-01-01')).toEqual({
      fromDate: '2026-01-01',
      toDate: '2026-03-31',
    });
  });

  it('rejects an invalid date', () => {
    expect(() => resolveDateRange('2026-02-30', '2026-03-01')).toThrow(
      'fromDate must be a valid date',
    );
  });
});
