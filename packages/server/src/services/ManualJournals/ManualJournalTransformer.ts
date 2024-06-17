import { IManualJournal } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { AttachmentTransformer } from '../Attachments/AttachmentTransformer';

export class ManualJournalTransfromer extends Transformer {
  /**
   * Include these attributes to expense object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedDate',
      'formattedPublishedAt',
      'formattedCreatedAt',
      'attachments',
    ];
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
   * Retrieve formatted created at date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedCreatedAt = (manualJorunal: IManualJournal): string => {
    return this.formatDate(manualJorunal.createdAt);
  };

  /**
   * Retrieve formatted published at date.
   * @param {IManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedPublishedAt = (manualJorunal: IManualJournal): string => {
    return this.formatDate(manualJorunal.publishedAt);
  };

  /**
   * Retrieves the manual journal attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (manualJorunal: IManualJournal) => {
    return this.item(manualJorunal.attachments, new AttachmentTransformer());
  };
}
