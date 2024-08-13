import { IPaymentReceived, IPaymentReceivedEntry } from '@/interfaces';
import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';
import { PaymentReceivedEntryTransfromer } from './PaymentReceivedEntryTransformer';

export class PaymentReceiveTransfromer extends Transformer {
  /**
   * Include these attributes to payment receive object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'subtotalFormatted',
      'formattedPaymentDate',
      'formattedCreatedAt',
      'formattedAmount',
      'formattedExchangeRate',
      'entries',
    ];
  };

  /**
   * Retrieve formatted payment receive date.
   * @param {ISaleInvoice} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (payment: IPaymentReceived): string => {
    return this.formatDate(payment.paymentDate);
  };

  /**
   * Retrieves the formatted created at date.
   * @param {IPaymentReceived} payment
   * @returns {string}
   */
  protected formattedCreatedAt = (payment: IPaymentReceived): string => {
    return this.formatDate(payment.createdAt);
  };

  /**
   * Retrieve the formatted payment subtotal.
   * @param {IPaymentReceived} payment
   * @returns {string}
   */
  protected subtotalFormatted = (payment: IPaymentReceived): string => {
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
  protected formattedAmount = (payment: IPaymentReceived): string => {
    return formatNumber(payment.amount, { currencyCode: payment.currencyCode });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param   {IPaymentReceived} payment
   * @returns {string}
   */
  protected formattedExchangeRate = (payment: IPaymentReceived): string => {
    return formatNumber(payment.exchangeRate, { money: false });
  };

  /**
   * Retrieves the payment entries.
   * @param {IPaymentReceived} payment
   * @returns {IPaymentReceivedEntry[]}
   */
  protected entries = (payment: IPaymentReceived): IPaymentReceivedEntry[] => {
    return this.item(payment.entries, new PaymentReceivedEntryTransfromer());
  };
}
