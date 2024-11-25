import { PaymentReceiveEntry } from '@/models';
import { PaymentReceiveTransfromer } from './PaymentReceivedTransformer';
import { PaymentReceivedEntryTransfromer } from './PaymentReceivedEntryTransformer';

export class GetPaymentReceivedMailStateTransformer extends PaymentReceiveTransfromer {
  /**
   * Exclude these attributes from user object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Included attributes.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'paymentDate',
      'paymentDateFormatted',

      'paymentAmount',
      'paymentAmountFormatted',

      'total',
      'totalFormatted',

      'subtotal',
      'subtotalFormatted',

      'paymentNumber',

      'entries',

      'companyName',
      'companyLogoUri',

      'primaryColor',

      'customerName',
    ];
  };

  /**
   * Retrieves the customer name of the payment.
   * @returns {string}
   */
  protected customerName = (payment) => {
    return payment.customer.displayName;
  };

  /**
   * Retrieves the company name.
   * @returns {string}
   */
  protected companyName = () => {
    return this.context.organization.name;
  };

  /**
   * Retrieves the company logo uri.
   * @returns {string | null}
   */
  protected companyLogoUri = (payment) => {
    return payment.pdfTemplate?.companyLogoUri;
  };

  /**
   * Retrieves the primary color.
   * @returns {string}
   */
  protected primaryColor = (payment) => {
    return payment.pdfTemplate?.attributes?.primaryColor;
  };

  /**
   * Retrieves the formatted payment date.
   * @returns {string}
   */
  protected paymentDateFormatted = (payment) => {
    return this.formatDate(payment.paymentDate);
  };

  /**
   * Retrieves the payment amount.
   * @param payment
   * @returns {number}
   */
  protected total = (payment) => {
    return this.formatNumber(payment.amount, {
      money: false,
    });
  };

  /**
   * Retrieves the formatted payment amount.
   * @returns {string}
   */
  protected totalFormatted = (payment) => {
    return this.formatMoney(payment.amount);
  };

  /**
   * Retrieves the payment amount.
   * @param payment
   * @returns {number}
   */
  protected subtotal = (payment) => {
    return this.formatNumber(payment.amount, {
      money: false,
    });
  };

  /**
   * Retrieves the formatted payment amount.
   * @returns {string}
   */
  protected subtotalFormatted = (payment) => {
    return this.formatMoney(payment.amount);
  };

  /**
   * Retrieves the payment number.
   * @param payment
   * @returns {string}
   */
  protected paymentNumber = (payment) => {
    return payment.paymentReceiveNo;
  };

  /**
   * Retrieves the payment entries.
   * @param {IPaymentReceived} payment
   * @returns {IPaymentReceivedEntry[]}
   */
  protected entries = (payment) => {
    return this.item(payment.entries, new GetPaymentReceivedEntryMailState());
  };

  /**
   * Merges the mail options with the invoice object.
   */
  public transform = (object: any) => {
    return {
      ...this.options.mailOptions,
      ...object,
    };
  };
}

export class GetPaymentReceivedEntryMailState extends PaymentReceivedEntryTransfromer {
  /**
   * Include these attributes to payment receive entry object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return ['paidAmount', 'invoiceNumber'];
  };

  /**
   * Exclude these attributes from user object.
   * @returns {Array}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Retrieves the paid amount.
   * @param entry
   * @returns {string}
   */
  public paidAmount = (entry) => {
    return this.paymentAmountFormatted(entry);
  };

  /**
   * Retrieves the invoice number.
   * @param entry
   * @returns {string}
   */
  public invoiceNumber = (entry) => {
    return entry.invoice.invoiceNo;
  };
}
