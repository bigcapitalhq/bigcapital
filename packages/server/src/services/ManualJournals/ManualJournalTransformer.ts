import { IManualJournal } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class ManualJournalTransfromer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedAmount', 'formattedDate', 'formattedPublishedAt'];
  };

  /**
   * Retrieve formatted journal amount.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedAmount = (manualJournal: IManualJournal): string => {
    return formatNumber(manualJournal.amount, {
      currencyCode: manualJournal.currencyCode,
    });
  };

  /**
   * Retrieve formatted date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedDate = (manualJournal: IManualJournal): string => {
    return this.formatDate(manualJournal.date);
  };

  /**
   * Retrieve formatted published at date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedPublishedAt = (manualJournal: IManualJournal): string => {
    return this.formatDate(manualJournal.publishedAt);
  };
}
