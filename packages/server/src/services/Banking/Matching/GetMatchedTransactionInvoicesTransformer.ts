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
      'dateFormatted',
      'transactionId',
      'transactionNo',
      'transactionType',
      'transsactionTypeFormatted',
      'transactionNormal',
      'referenceType',
      'referenceId'
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
  protected amountFormatted(invoice) {
    return this.formatNumber(invoice.dueAmount, {
      currencyCode: invoice.currencyCode,
      money: true,
    });
  }

  /**
   * Retrieve the date of the invoice.
   * @param invoice
   * @returns {Date}
   */
  protected date(invoice) {
    return invoice.invoiceDate;
  }

  /**
   * Format the date of the invoice.
   * @param invoice
   * @returns {string}
   */
  protected dateFormatted(invoice) {
    return this.formatDate(invoice.invoiceDate);
  }

  /**
   * Retrieve the transaction ID of the invoice.
   * @param invoice
   * @returns {number}
   */
  protected transactionId(invoice) {
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

  /**
   * Retrieve the transaction normal of invoice (credit or debit).
   * @returns {string}
   */
  protected transactionNormal() {
    return 'debit';
  }

  /**
   * Retrieve the transaction reference type.
   * @returns {string}
   */  protected referenceType() {
    return 'SaleInvoice';
  }

  /**
   * Retrieve the transaction reference id.
   * @param transaction 
   * @returns {number}
   */
  protected referenceId(transaction) {
    return transaction.id;
  }
}
