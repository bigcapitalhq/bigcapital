import { Service } from 'typedi';
import { ISaleEstimate } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export default class SaleEstimateTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedEstimateDate',
      'formattedExpirationDate',
      'formattedDeliveredAtDate',
      'formattedApprovedAtDate',
      'formattedRejectedAtDate',
    ];
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedEstimateDate = (estimate: ISaleEstimate): string => {
    return this.formatDate(estimate.estimateDate);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedExpirationDate = (estimate: ISaleEstimate): string => {
    return this.formatDate(estimate.expirationDate);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedDeliveredAtDate = (estimate: ISaleEstimate): string => {
    return this.formatDate(estimate.deliveredAt);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedApprovedAtDate = (estimate: ISaleEstimate): string => {
    return this.formatDate(estimate.approvedAt);
  };

  /**
   * Retrieve formatted estimate date.
   * @param {ISaleEstimate} invoice
   * @returns {String}
   */
  protected formattedRejectedAtDate = (estimate: ISaleEstimate): string => {
    return this.formatDate(estimate.rejectedAt);
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ISaleEstimate} estimate
   * @returns {string}
   */
  protected formattedAmount = (estimate: ISaleEstimate): string => {
    return formatNumber(estimate.amount, {
      currencyCode: estimate.currencyCode,
    });
  };
}
