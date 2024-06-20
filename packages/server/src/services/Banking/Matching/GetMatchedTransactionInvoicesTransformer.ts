import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionInvoicesTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'referenceNo',
      'amount',
      'amountFormatted',
      'transactionNo',
      'date',
      'dateFromatted',
      'transactionId',
      'transactionNo',
      'transactionType',
      'transsactionTypeFormatted',
    ];
  };

  /**
   * Exclude all attributes.
   * @returns {Array<string>}
   */
  public excludeAttributes = (): string[] => {
    return ['*'];
  };

  /**
   * Retrieve the invoice reference number.
   * @returns {string}
   */
  protected referenceNo(invoice) {
    return invoice.referenceNo;
  }

  /**
   * Retrieve the invoice amount.
   * @param invoice
   * @returns {number}
   */
  protected amount(invoice) {
    return invoice.dueAmount;
  }
  /**
   * Format the amount of the invoice.
   * @param invoice
   * @returns {string}
   */
  protected formatAmount(invoice) {
    return this.formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
    });
  }

  /**
   * Retrieve the date of the invoice.
   * @param invoice
   * @returns {Date}
   */
  protected getDate(invoice) {
    return invoice.invoiceDate;
  }

  /**
   * Format the date of the invoice.
   * @param invoice
   * @returns {string}
   */
  protected formatDate(invoice) {
    return this.formatDate(invoice.invoiceDate);
  }

  /**
   * Retrieve the transaction ID of the invoice.
   * @param invoice
   * @returns {number}
   */
  protected getTransactionId(invoice) {
    return invoice.id;
  }
  /**
   * Retrieve the invoice transaction number.
   * @param invoice
   * @returns {string}
   */
  protected transactionNo(invoice) {
    return invoice.invoiceNo;
  }

  /**
   * Retrieve the invoice transaction type.
   * @param invoice
   * @returns {String}
   */
  protected transactionType(invoice) {
    return 'SaleInvoice';
  }

  /**
   * Retrieve the invoice formatted transaction type.
   * @param invoice
   * @returns {string}
   */
  protected transsactionTypeFormatted(invoice) {
    return 'Sale invoice';
  }
}
