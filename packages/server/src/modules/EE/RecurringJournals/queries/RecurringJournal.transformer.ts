import { Transformer } from '@/modules/Transformer/Transformer';
import { RecurringJournal } from '../models/RecurringJournal';

export class RecurringJournalTransformer extends Transformer {
  /**
   * Include these attributes to the recurring journal object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'startDateFormatted',
      'endDateFormatted',
      'nextJournalDateFormatted',
      'lastJournalDateFormatted',
      'createdAtFormatted',
      'amountFormatted',
      'entries',
    ];
  };

  protected startDateFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatDate(recurringJournal.startDate);
  };

  protected endDateFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatDate(recurringJournal.endDate);
  };

  protected nextJournalDateFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatDate(recurringJournal.nextJournalDate);
  };

  protected lastJournalDateFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatDate(recurringJournal.lastJournalDate);
  };

  protected createdAtFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatDate(recurringJournal.createdAt);
  };

  protected amountFormatted = (recurringJournal: RecurringJournal) => {
    return this.formatNumber(recurringJournal.amount, {
      currencyCode: recurringJournal.currencyCode,
    });
  };

  protected entries = (recurringJournal: RecurringJournal) => {
    return recurringJournal.entries ?? [];
  };
}
