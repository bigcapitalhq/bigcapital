import { IPaymentReceive, IPaymentReceiveEntry } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '../../../utils';
import { PaymentReceiveEntryTransfromer } from './PaymentReceiveEntryTransformer';

export class PaymentReceiveTransfromer extends Transformer {
  /**
   * Include these attributes to payment receive object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['subtotalFormatted', 'formattedPaymentDate', 'formattedAmount', 'formattedExchangeRate', 'entries'];
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
   * Retrieve the formatted payment subtotal.
   * @param {IPaymentReceive} payment
   * @returns {string}
   */
  protected subtotalFormatted = (payment: IPaymentReceive): string => {
    return formatNumber(payment.amount, {
      currencyCode: payment.currencyCode,
      money: false,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {ISaleInvoice} invoice
   * @returns {string}
   */
  protected formattedAmount = (payment: IPaymentReceive): string => {
    return formatNumber(payment.amount, { currencyCode: payment.currencyCode });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param   {IPaymentReceive} payment
   * @returns {string}
   */
  protected formattedExchangeRate = (payment: IPaymentReceive): string => {
    return formatNumber(payment.exchangeRate, { money: false });
  };

  /**
   * Retrieves the payment entries.
   * @param {IPaymentReceive} payment
   * @returns {IPaymentReceiveEntry[]}
   */
  protected entries = (payment: IPaymentReceive): IPaymentReceiveEntry[] => {
    return this.item(payment.entries, new PaymentReceiveEntryTransfromer());
  };
}
