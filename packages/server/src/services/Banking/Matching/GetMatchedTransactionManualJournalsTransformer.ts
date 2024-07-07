import { sumBy } from 'lodash';
import { Transformer } from '@/lib/Transformer/Transformer';
import { AccountNormal } from '@/interfaces';

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
   * Retrieves the manual journal reference no.
   * @param manualJournal
   * @returns {string}
   */
  protected referenceNo(manualJournal) {
    return manualJournal.referenceNo;
  }

  protected total(manualJournal) {
    const credit = sumBy(manualJournal?.entries, 'credit');
    const debit = sumBy(manualJournal?.entries, 'debit');

    return debit - credit;
  }

  /**
   * Retrieves the manual journal amount.
   * @param manualJournal
   * @returns {number}
   */
  protected amount(manualJournal) {
    return Math.abs(this.total(manualJournal));
  }

  /**
   * Retrieves the manual journal formatted amount.
   * @param manualJournal
   * @returns {string}
   */
  protected amountFormatted(manualJournal) {
    return this.formatNumber(manualJournal.amount, {
      currencyCode: manualJournal.currencyCode,
      money: true,
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
  protected dateFormatted(manualJournal) {
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

  /**
   * Retrieve the manual journal transaction normal (credit or debit).
   * @returns {string}
   */
  protected transactionNormal(transaction) {
    const amount = this.total(transaction);

    return amount >= 0 ? AccountNormal.DEBIT : AccountNormal.CREDIT;
  }

  /**
   * Retrieve the manual journal reference type.
   * @returns {string}
   */
  protected referenceType() {
    return 'ManualJournal';
  }

  /**
   * Retrieves the manual journal reference id.
   * @param transaction
   * @returns {number}
   */
  protected referenceId(transaction) {
    return transaction.id;
  }
}
