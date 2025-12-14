import { Transformer } from '../../Transformer/Transformer';
import { PaymentReceived } from '../models/PaymentReceived';
import { PaymentReceivedEntry } from '../models/PaymentReceivedEntry';
import { PaymentReceivedEntryTransfromer } from './PaymentReceivedEntryTransformer';

export class PaymentReceiveTransfromer extends Transformer {
  /**
   * Include these attributes to payment receive object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'subtotalFormatted',
      'formatttedTotal',
      'formattedPaymentDate',
      'formattedCreatedAt',
      'formattedAmount',
      'formattedExchangeRate',
      'entries',
    ];
  };

  /**
   * Retrieve formatted payment receive date.
   * @param {PaymentReceived} invoice
   * @returns {String}
   */
  protected formattedPaymentDate = (payment: PaymentReceived): string => {
    return this.formatDate(payment.paymentDate);
  };

  /**
   * Retrieves the formatted created at date.
   * @param {PaymentReceived} payment
   * @returns {string}
   */
  protected formattedCreatedAt = (payment: PaymentReceived): string => {
    return this.formatDate(payment.createdAt);
  };

  /**
   * Retrieve the formatted payment subtotal.
   * @param {PaymentReceived} payment
   * @returns {string}
   */
  protected subtotalFormatted = (payment: PaymentReceived): string => {
    return this.formatNumber(payment.amount, {
      currencyCode: payment.currencyCode,
    });
  };

  /**
   * Retrieves the formatted total.
   * @param {PaymentReceived} payment
   * @returns {string}
   */
  protected formatttedTotal = (payment: PaymentReceived): string => {
    return this.formatNumber(payment.amount, {
      currencyCode: payment.currencyCode,
      money: true,
    });
  };

  /**
   * Retrieve formatted payment amount.
   * @param {PaymentReceived} invoice
   * @returns {string}
   */
  protected formattedAmount = (payment: PaymentReceived): string => {
    return this.formatNumber(payment.amount, {
      currencyCode: payment.currencyCode,
    });
  };

  /**
   * Retrieve the formatted exchange rate.
   * @param   {PaymentReceived} payment
   * @returns {string}
   */
  protected formattedExchangeRate = (payment: PaymentReceived): string => {
    return this.formatNumber(payment.exchangeRate);
  };

  /**
   * Retrieves the payment entries.
   * @param {PaymentReceived} payment
   * @returns {IPaymentReceivedEntry[]}
   */
  protected entries = (payment: PaymentReceived): PaymentReceivedEntry[] => {
    return this.item(payment.entries, new PaymentReceivedEntryTransfromer());
  };
}
