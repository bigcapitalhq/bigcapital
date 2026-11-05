import * as moment from 'moment';
import {
  BankRowKeyFields,
  bankRowKey,
  findDuplicateRowIndexes,
  formatDuplicateRowMessage,
  parseBankRowDate,
} from './bankImportDuplicates';

const X: BankRowKeyFields = {
  date: '2026-01-08',
  amount: -5,
  payee: 'Tim Hortons',
  description: 'POS 123',
  referenceNo: null,
};

describe('bankRowKey', () => {
  it('ignores letter case and extra whitespace in text fields', () => {
    expect(bankRowKey({ ...X, payee: '  TIM   hortons ' })).toBe(bankRowKey(X));
  });

  it('treats null, empty and missing text the same', () => {
    expect(bankRowKey({ ...X, referenceNo: '' })).toBe(bankRowKey(X));
    expect(bankRowKey({ ...X, referenceNo: undefined })).toBe(bankRowKey(X));
  });

  it('matches accented text regardless of case', () => {
    expect(bankRowKey({ ...X, description: 'ÉPICERIE  Métro' })).toBe(
      bankRowKey({ ...X, description: 'épicerie métro' }),
    );
  });

  it('matches a Date object and a YYYY-MM-DD string for the same day', () => {
    expect(bankRowKey({ ...X, date: new Date(2026, 0, 8) })).toBe(
      bankRowKey({ ...X, date: '2026-01-08' }),
    );
  });

  it('matches a decimal string and a number for the same amount', () => {
    expect(bankRowKey({ ...X, amount: '-1234.50' })).toBe(
      bankRowKey({ ...X, amount: -1234.5 }),
    );
  });

  it('distinguishes a withdrawal from a deposit of the same size', () => {
    expect(bankRowKey({ ...X, amount: -5 })).not.toBe(
      bankRowKey({ ...X, amount: 5 }),
    );
  });

  it('distinguishes rows whose reference differs', () => {
    expect(bankRowKey({ ...X, referenceNo: 'A1' })).not.toBe(
      bankRowKey({ ...X, referenceNo: null }),
    );
  });
});

describe('findDuplicateRowIndexes', () => {
  const A: BankRowKeyFields = { ...X, amount: 10 };
  const B: BankRowKeyFields = { ...X, amount: 20 };

  it('imports identical rows in one file when the account is empty', () => {
    expect(findDuplicateRowIndexes([X, X], [])).toEqual([]);
  });

  it('skips only as many occurrences as the account already has', () => {
    expect(findDuplicateRowIndexes([X, X], [X])).toEqual([0]);
  });

  it('skips every file occurrence when the account has more', () => {
    expect(findDuplicateRowIndexes([X], [X, X])).toEqual([0]);
  });

  it('skips only the matching row among others', () => {
    expect(findDuplicateRowIndexes([A, X, B], [X])).toEqual([1]);
  });

  it('skips all occurrences when the account has the same number', () => {
    expect(findDuplicateRowIndexes([X, X], [X, X])).toEqual([0, 1]);
  });

  it('never skips a row without a date, nor lets it use up a match', () => {
    const today: BankRowKeyFields = {
      ...X,
      date: moment().format('YYYY-MM-DD'),
    };
    expect(
      findDuplicateRowIndexes([{ ...today, date: undefined }, today], [today]),
    ).toEqual([1]);
  });

  it('never skips a row whose date is not YYYY-MM-DD', () => {
    expect(
      findDuplicateRowIndexes([{ ...X, date: '2026/01/08' }, X], [X]),
    ).toEqual([1]);
  });
});

describe('parseBankRowDate', () => {
  it('reads YYYY-MM-DD strings and Date objects', () => {
    expect(parseBankRowDate('2026-01-08')).toBe('2026-01-08');
    expect(parseBankRowDate(new Date(2026, 0, 8))).toBe('2026-01-08');
  });

  it('rejects missing and non YYYY-MM-DD dates', () => {
    expect(parseBankRowDate(undefined)).toBeNull();
    expect(parseBankRowDate('')).toBeNull();
    expect(parseBankRowDate('2026/01/08')).toBeNull();
    expect(parseBankRowDate('not a date')).toBeNull();
  });
});

describe('formatDuplicateRowMessage', () => {
  it('names the date, payee and amount', () => {
    expect(formatDuplicateRowMessage(X)).toBe(
      'Already in this bank account: 2026-01-08, Tim Hortons, -5.00',
    );
  });

  it('falls back to the description when there is no payee', () => {
    expect(formatDuplicateRowMessage({ ...X, payee: null })).toBe(
      'Already in this bank account: 2026-01-08, POS 123, -5.00',
    );
  });

  it('leaves the text out when there is no payee or description', () => {
    expect(
      formatDuplicateRowMessage({ ...X, payee: null, description: null }),
    ).toBe('Already in this bank account: 2026-01-08, -5.00');
  });
});
