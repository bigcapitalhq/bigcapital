import { Service } from 'typedi';
import { IPaymentReceive } from 'interfaces';
import { Transformer } from 'lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export default class PaymentReceiveTransfromer extends Transformer {
  /**
   * Include these attributes to payment receive object.
   * @returns {Array}
   */
  protected includeAttributes = (): string[] => {
    return ['formattedPaymentDate', 'formattedAmount'];
  };

  /**
   * Retrieve formatted payment receive date.
   * @param {ISaleInvoice} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (payment: IPaymentReceive): string => {
    return this.formatDate(payment.paymentDate);
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedAmount = (payment: IPaymentReceive): string => {
    return formatNumber(payment.amount, { currencyCode: payment.currencyCode });
  };
}
