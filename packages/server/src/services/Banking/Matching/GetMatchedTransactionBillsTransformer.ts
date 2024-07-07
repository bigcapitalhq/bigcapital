import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionBillsTransformer extends Transformer {
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
   * Retrieve the reference number of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected referenceNo(bill) {
    return bill.referenceNo;
  }

  /**
   * Retrieve the amount of the bill.
   * @param {Object} bill - The bill object.
   * @returns {number}
   */
  protected amount(bill) {
    return bill.amount;
  }

  /**
   * Retrieve the formatted amount of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected amountFormatted(bill) {
    return this.formatNumber(bill.amount, {
      currencyCode: bill.currencyCode,
      money: true,
    });
  }

  /**
   * Retrieve the date of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected date(bill) {
    return bill.billDate;
  }

  /**
   * Retrieve the formatted date of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected dateFormatted(bill) {
    return this.formatDate(bill.billDate);
  }

  /**
   * Retrieve the transcation id of the bill.
   * @param {Object} bill - The bill object.
   * @returns {number}
   */
  protected transactionId(bill) {
    return bill.id;
  }

  /**
   * Retrieve the manual journal transaction type.
   * @returns {string}
   */
  protected transactionType() {
    return 'Bill';
  }

  /**
   * Retrieves the manual journal formatted transaction type.
   * @returns {string}
   */
  protected transsactionTypeFormatted() {
    return 'Bill';
  }

  /**
   * Retrieves the bill transaction normal (debit or credit).
   * @returns {string}
   */
  protected transactionNormal() {
    return 'credit';
  }

  /**
   * Retrieve the match transaction reference id.
   * @param bill
   * @returns {number}
   */
  protected referenceId(bill) {
    return bill.id;
  }

  /**
   * Retrieve the match transaction referenece type.
   * @returns {string}
   */
  protected referenceType() {
    return 'Bill';
  }
}
