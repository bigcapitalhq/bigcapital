import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class BillPaymentTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['formattedPaymentAmount', 'formattedPaymentDate'];
  };

  /**
   * Retrieve formatted bill payment amount.
   * @param {ICreditNote} credit
   * @returns {string}
   */
  protected formattedPaymentAmount = (entry): string => {
    return formatNumber(entry.paymentAmount, {
      currencyCode: entry.payment.currencyCode,
    });
  };

  /**
   * Retrieve formatted bill payment date.
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
      billId: entry.billId,
      billPaymentId: entry.billPaymentId,

      paymentDate: entry.payment.paymentDate,
      formattedPaymentDate: entry.formattedPaymentDate,

      paymentAmount: entry.paymentAmount,
      formattedPaymentAmount: entry.formattedPaymentAmount,
      currencyCode: entry.payment.currencyCode,

      paymentNumber: entry.payment.paymentNumber,
      paymentReferenceNo: entry.payment.reference,

      billNumber: entry.bill.billNumber,
      billReferenceNo: entry.bill.referenceNo,

      paymentAccountId: entry.payment.paymentAccountId,
      paymentAccountName: entry.payment.paymentAccount.name,
      paymentAccountSlug: entry.payment.paymentAccount.slug,
    };
  };
}
