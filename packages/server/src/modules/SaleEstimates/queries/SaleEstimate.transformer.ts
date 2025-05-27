import { Transformer } from '@/modules/Transformer/Transformer';
import { SaleEstimate } from '../models/SaleEstimate';
import { ItemEntryTransformer } from '@/modules/TransactionItemEntry/ItemEntry.transformer';
import { AttachmentTransformer } from '@/modules/Attachments/Attachment.transformer';

export class SaleEstimateTransfromer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedSubtotal',
      'formattedAmount',
      'formattedEstimateDate',
      'formattedExpirationDate',
      'formattedDeliveredAtDate',
      'formattedApprovedAtDate',
      'formattedRejectedAtDate',
      'formattedCreatedAt',
      'entries',
      'attachments',
    ];
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedEstimateDate = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.estimateDate);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedExpirationDate = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.expirationDate);
  };

  /**
   * Retrieves the formatted estimate created at.
   * @param {ISaleEstimate} estimate -
   * @returns {string}
   */
  protected formattedCreatedAt = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.createdAt);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedDeliveredAtDate = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.deliveredAt);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedApprovedAtDate = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.approvedAt);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedRejectedAtDate = (estimate: SaleEstimate): string => {
    return this.formatDate(estimate.rejectedAt);
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleEstimate} estimate
   * @returns {string}
   */
  protected formattedAmount = (estimate: SaleEstimate): string => {
    return this.formatNumber(estimate.amount, {
      currencyCode: estimate.currencyCode,
    });
  };

  /**
   * Retrieves the formatted invoice subtotal.
   * @param {ISaleEstimate} estimate
   * @returns {string}
   */
  protected formattedSubtotal = (estimate: SaleEstimate): string => {
    return this.formatNumber(estimate.amount, { money: false });
  };

  /**
   * Retrieves the entries of the sale estimate.
   * @param {ISaleEstimate} estimate
   * @returns {}
   */
  protected entries = (estimate: SaleEstimate) => {
    return this.item(estimate.entries, new ItemEntryTransformer(), {
      currencyCode: estimate.currencyCode,
    });
  };

  /**
   * Retrieves the sale estimate attachments.
   * @param {ISaleInvoice} invoice
   * @returns
   */
  protected attachments = (estimate: SaleEstimate) => {
    return this.item(estimate.attachments, new AttachmentTransformer());
  };
}
