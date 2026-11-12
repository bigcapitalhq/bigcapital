import {
  isWriteoffDateBeforeInvoiceDate,
  resolveWriteoffDate,
} from './writeoffDate';

describe('resolveWriteoffDate', () => {
  it('uses the requested date', () => {
    expect(resolveWriteoffDate('2023-03-15', '2023-01-01', '2026-11-05')).toBe(
      '2023-03-15',
    );
  });

  it('keeps the calendar day of an ISO datetime with an offset', () => {
    expect(
      resolveWriteoffDate(
        '2023-03-15T23:30:00-05:00',
        '2023-01-01',
        '2026-11-05',
      ),
    ).toBe('2023-03-15');
  });

  it('defaults to today', () => {
    expect(resolveWriteoffDate(undefined, '2023-01-01', '2026-11-05')).toBe(
      '2026-11-05',
    );
  });

  it('defaults to the invoice date when the invoice is dated after today', () => {
    expect(resolveWriteoffDate(undefined, '2026-12-01', '2026-11-05')).toBe(
      '2026-12-01',
    );
  });
});

describe('isWriteoffDateBeforeInvoiceDate', () => {
  it('is true the day before the invoice date', () => {
    expect(isWriteoffDateBeforeInvoiceDate('2022-12-31', '2023-01-01')).toBe(
      true,
    );
  });

  it('is false on the invoice date', () => {
    expect(isWriteoffDateBeforeInvoiceDate('2023-01-01', '2023-01-01')).toBe(
      false,
    );
  });

  it('is false after the invoice date', () => {
    expect(isWriteoffDateBeforeInvoiceDate('2023-03-15', '2023-01-01')).toBe(
      false,
    );
  });
});
