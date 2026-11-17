import {
  addOccurrence,
  getFirstOccurrenceOnOrAfter,
  isScheduleExhausted,
} from './recurrence';
import { RecurringInvoiceFrequency } from '../RecurringInvoice.types';

describe('recurrence utils', () => {
  describe('addOccurrence', () => {
    it('adds days and weeks', () => {
      expect(
        addOccurrence(
          '2026-01-01',
          '2026-01-01',
          RecurringInvoiceFrequency.Day,
          3,
        ),
      ).toBe('2026-01-04');
      expect(
        addOccurrence(
          '2026-01-01',
          '2026-01-01',
          RecurringInvoiceFrequency.Week,
          2,
        ),
      ).toBe('2026-01-15');
    });

    it('clamps monthly recurrence to the last day and returns to the anchor day', () => {
      expect(
        addOccurrence(
          '2026-01-31',
          '2026-01-31',
          RecurringInvoiceFrequency.Month,
          1,
        ),
      ).toBe('2026-02-28');
      expect(
        addOccurrence(
          '2026-02-28',
          '2026-01-31',
          RecurringInvoiceFrequency.Month,
          1,
        ),
      ).toBe('2026-03-31');
    });

    it('handles leap years for yearly recurrence', () => {
      expect(
        addOccurrence(
          '2027-02-28',
          '2024-02-29',
          RecurringInvoiceFrequency.Year,
          1,
        ),
      ).toBe('2028-02-29');
      expect(
        addOccurrence(
          '2024-02-29',
          '2024-02-29',
          RecurringInvoiceFrequency.Year,
          1,
        ),
      ).toBe('2025-02-28');
    });
  });

  describe('getFirstOccurrenceOnOrAfter', () => {
    it('returns the start date when it is in the future', () => {
      expect(
        getFirstOccurrenceOnOrAfter(
          '2026-12-01',
          '2026-11-05',
          RecurringInvoiceFrequency.Month,
          1,
        ),
      ).toBe('2026-12-01');
    });

    it('skips past occurrences when the start date is in the past', () => {
      expect(
        getFirstOccurrenceOnOrAfter(
          '2025-01-31',
          '2026-11-05',
          RecurringInvoiceFrequency.Month,
          1,
        ),
      ).toBe('2026-11-30');
    });

    it('returns null when the end date is before the next occurrence', () => {
      expect(
        getFirstOccurrenceOnOrAfter(
          '2026-01-01',
          '2026-11-05',
          RecurringInvoiceFrequency.Month,
          1,
          '2026-06-01',
        ),
      ).toBeNull();
    });
  });

  describe('isScheduleExhausted', () => {
    it('detects the max occurrences limit', () => {
      expect(
        isScheduleExhausted({
          maxOccurrences: 3,
          occurrencesCount: 3,
          nextInvoiceDate: '2026-12-01',
        }),
      ).toBe(true);
    });

    it('detects the end date limit', () => {
      expect(
        isScheduleExhausted({
          endDate: '2026-11-30',
          occurrencesCount: 1,
          nextInvoiceDate: '2026-12-01',
        }),
      ).toBe(true);
    });

    it('returns false while the schedule is still running', () => {
      expect(
        isScheduleExhausted({
          endDate: '2027-11-30',
          maxOccurrences: 12,
          occurrencesCount: 2,
          nextInvoiceDate: '2026-12-01',
        }),
      ).toBe(false);
    });
  });
});
