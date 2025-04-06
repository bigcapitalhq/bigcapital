import { Transformer } from '@/modules/Transformer/Transformer';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';
import { ManualJournal } from '../models/ManualJournal';

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
  protected formattedAmount = (manualJorunal: ManualJournal): string => {
    return this.formatNumber(manualJorunal.amount, {
      currencyCode: manualJorunal.currencyCode,
    });
  };

  /**
   * Retrieve formatted date.
   * @param {ManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedDate = (manualJorunal: ManualJournal): string => {
    return this.formatDate(manualJorunal.date);
  };

  /**
   * Retrieve formatted created at date.
   * @param {ManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedCreatedAt = (manualJorunal: ManualJournal): string => {
    return this.formatDate(manualJorunal.createdAt);
  };

  /**
   * Retrieve formatted published at date.
   * @param {ManualJournal} manualJournal
   * @returns {string}
   */
  protected formattedPublishedAt = (manualJorunal: ManualJournal): string => {
    return this.formatDate(manualJorunal.publishedAt);
  };

  /**
   * Retrieves the manual journal attachments.
   * @param {ManualJournal} manualJorunal
   * @returns
   */
  protected attachments = (manualJorunal: ManualJournal) => {
    return this.item(manualJorunal.attachments, new AttachmentTransformer());
  };
}
