import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class InvoicePaymentTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedPaymentAmount', 'formattedPaymentDate'];
  };

  /**
   * Retrieve formatted invoice amount.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedPaymentAmount = (entry): string => {
    return formatNumber(entry.paymentAmount, {
      currencyCode: entry.payment.currencyCode,
    });
  };

  /**
   * Formatted payment date.
   * @param entry 
   * @returns {string}
   */
  protected formattedPaymentDate = (entry): string => {
    return this.formatDate(entry.payment.paymentDate);
  };

  /**
   *
   * @param entry
   * @returns
   */
  public transform = (entry) => {
    return {
      invoiceId: entry.invoiceId,
      paymentReceiveId: entry.paymentReceiveId,

      paymentDate: entry.payment.paymentDate,
      formattedPaymentDate: entry.formattedPaymentDate,

      paymentAmount: entry.paymentAmount,
      formattedPaymentAmount: entry.formattedPaymentAmount,
      currencyCode: entry.payment.currencyCode,

      paymentNumber: entry.payment.paymentReceiveNo,
      paymentReferenceNo: entry.payment.referenceNo,

      invoiceNumber: entry.invoice.invoiceNo,
      invoiceReferenceNo: entry.invoice.referenceNo,

      depositAccountId: entry.payment.depositAccountId,
      depositAccountName: entry.payment.depositAccount.name,
      depositAccountSlug: entry.payment.depositAccount.slug,
    };
  };
}
