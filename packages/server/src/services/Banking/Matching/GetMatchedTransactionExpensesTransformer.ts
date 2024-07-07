import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionExpensesTransformer extends Transformer {
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
      'referenceId',
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
   * Retrieves the expense reference number.
   * @param expense
   * @returns {string}
   */
  protected referenceNo(expense) {
    return expense.referenceNo;
  }

  /**
   * Retrieves the expense amount.
   * @param expense
   * @returns {number}
   */
  protected amount(expense) {
    return expense.totalAmount;
  }

  /**
   * Formats the amount of the expense.
   * @param expense
   * @returns {string}
   */
  protected amountFormatted(expense) {
    return this.formatNumber(expense.totalAmount, {
      currencyCode: expense.currencyCode,
      money: true,
    });
  }

  /**
   * Retrieves the date of the expense.
   * @param expense
   * @returns {Date}
   */
  protected date(expense) {
    return expense.paymentDate;
  }

  /**
   * Formats the date of the expense.
   * @param expense
   * @returns {string}
   */
  protected dateFormatted(expense) {
    return this.formatDate(expense.paymentDate);
  }

  /**
   * Retrieves the transaction ID of the expense.
   * @param expense
   * @returns {number}
   */
  protected transactionId(expense) {
    return expense.id;
  }

  /**
   * Retrieves the expense transaction number.
   * @param expense
   * @returns {string}
   */
  protected transactionNo(expense) {
    return expense.expenseNo;
  }

  /**
   * Retrieves the expense transaction type.
   * @param expense
   * @returns {String}
   */
  protected transactionType() {
    return 'Expense';
  }

  /**
   * Retrieves the formatted transaction type of the expense.
   * @param expense
   * @returns {string}
   */
  protected transsactionTypeFormatted() {
    return 'Expense';
  }

  /**
   * Retrieve the expense transaction normal (credit or debit).
   * @returns {string}
   */
  protected transactionNormal() {
    return 'credit';
  }

  /**
   * Retrieve the transaction reference type.
   * @returns {string}
   */
  protected referenceType() {
    return 'Expense';
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
