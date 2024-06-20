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
    return this.formatNumber(bill.totalAmount, {
      currencyCode: bill.currencyCode,
    });
  }

  /**
   * Retrieve the date of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected date(bill) {
    return bill.date;
  }

  /**
   * Retrieve the formatted date of the bill.
   * @param {Object} bill - The bill object.
   * @returns {string}
   */
  protected dateFromatted(bill) {
    return this.formatDate(bill.date);
  }

  /**
   * Retrieve the transcation id of the bill.
   * @param {Object} bill - The bill object.
   * @returns {number}
   */
  protected transactionId(bill) {
    return bill.id;
  }
}
