import { IManualJournal } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { Service } from 'typedi';
import { formatNumber } from 'utils';

@Service()
export default class ManualJournalTransfromer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return ['formattedAmount', 'formattedDate', 'formattedPublishedAt'];
  };

  /**
   * Retrieve formatted journal amount.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedAmount = (manualJorunal: IManualJournal): string => {
    return formatNumber(manualJorunal.amount, {
      currencyCode: manualJorunal.currencyCode,
    });
  };

  /**
   * Retrieve formatted date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedDate = (manualJorunal: IManualJournal): string => {
    return this.formatDate(manualJorunal.date);
  };

  /**
   * Retrieve formatted published at date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedPublishedAt = (manualJorunal: IManualJournal): string => {
    return this.formatDate(manualJorunal.publishedAt);
  };
}
