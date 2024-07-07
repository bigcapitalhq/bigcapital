import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionCashflowTransformer extends Transformer {
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
      'referenceId',
      'referenceType',
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
   * Retrieve the transaction amount.
   * @param transaction
   * @returns {number}
   */
  protected amount(transaction) {
    return transaction.amount;
  }

  /**
   * Retrieve the transaction formatted amount.
   * @param transaction
   * @returns {string}
   */
  protected amountFormatted(transaction) {
    return this.formatNumber(transaction.amount, {
      currencyCode: transaction.currencyCode,
      money: true,
    });
  }

  /**
   * Retrieve the date of the invoice.
   * @param invoice
   * @returns {Date}
   */
  protected date(transaction) {
    return transaction.date;
  }

  /**
   * Format the date of the invoice.
   * @param invoice
   * @returns {string}
   */
  protected dateFormatted(transaction) {
    return this.formatDate(transaction.date);
  }

  /**
   * Retrieve the transaction ID of the invoice.
   * @param invoice
   * @returns {number}
   */
  protected transactionId(transaction) {
    return transaction.id;
  }

  /**
   * Retrieve the invoice transaction number.
   * @param invoice
   * @returns {string}
   */
  protected transactionNo(transaction) {
    return transaction.transactionNumber;
  }

  /**
   * Retrieve the invoice transaction type.
   * @param invoice
   * @returns {String}
   */
  protected transactionType(transaction) {
    return transaction.transactionType;
  }

  /**
   * Retrieve the invoice formatted transaction type.
   * @param invoice
   * @returns {string}
   */
  protected transsactionTypeFormatted(transaction) {
    return transaction.transactionTypeFormatted;
  }

  /**
   * Retrieve the cashflow transaction normal (credit or debit).
   * @param transaction
   * @returns {string}
   */
  protected transactionNormal(transaction) {
    return transaction.isCashCredit ? 'credit' : 'debit';
  }

  /**
   * Retrieves the cashflow transaction reference id.
   * @param transaction
   * @returns {number}
   */
  protected referenceId(transaction) {
    return transaction.id;
  }

  /**
   * Retrieves the cashflow transaction reference type.
   * @returns {string}
   */
  protected referenceType() {
    return 'CashflowTransaction';
  }
}
