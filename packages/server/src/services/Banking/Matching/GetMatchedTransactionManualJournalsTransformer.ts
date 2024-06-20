import { Transformer } from '@/lib/Transformer/Transformer';

export class GetMatchedTransactionManualJournalsTransformer extends Transformer {
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
   * Retrieves the manual journal reference no.
   * @param manualJournal
   * @returns {string}
   */
  protected referenceNo(manualJournal) {
    return manualJournal.referenceNo;
  }

  /**
   * Retrieves the manual journal amount.
   * @param manualJournal
   * @returns {number}
   */
  protected amount(manualJournal) {
    return manualJournal.amount;
  }

  /**
   * Retrieves the manual journal formatted amount.
   * @param manualJournal
   * @returns {string}
   */
  protected amountFormatted(manualJournal) {
    return this.formatNumber(manualJournal.amount, {
      currencyCode: manualJournal.currencyCode,
    });
  }

  /**
   * Retreives the manual journal date.
   * @param manualJournal
   * @returns {Date}
   */
  protected date(manualJournal) {
    return manualJournal.date;
  }

  /**
   * Retrieves the manual journal formatted date.
   * @param manualJournal
   * @returns {string}
   */
  protected dateFromatted(manualJournal) {
    return this.formatDate(manualJournal.date);
  }

  /**
   * Retrieve the manual journal transaction id.
   * @returns {number}
   */
  protected transactionId(manualJournal) {
    return manualJournal.id;
  }

  /**
   * Retrieve the manual journal transaction number.
   * @param manualJournal
   */
  protected transactionNo(manualJournal) {
    return manualJournal.journalNumber;
  }

  /**
   * Retrieve the manual journal transaction type.
   * @returns {string}
   */
  protected transactionType() {
    return 'ManualJournal';
  }

  /**
   * Retrieves the manual journal formatted transaction type.
   * @returns {string}
   */
  protected transsactionTypeFormatted() {
    return 'Manual Journal';
  }
}
