import { Transformer } from '@/lib/Transformer/Transformer';
import { sumBy } from 'lodash';

export class GetAutofillCategorizeTransctionTransformer extends Transformer {
  /**
   * Included attributes to the object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'amount',
      'formattedAmount',
      'isRecognized',
      'date',
      'formattedDate',
      'creditAccountId',
      'debitAccountId',
      'referenceNo',
      'transactionType',
      'recognizedByRuleId',
      'recognizedByRuleName',
      'isWithdrawalTransaction',
      'isDepositTransaction',
    ];
  };

  /**
   * Detarmines whether the transaction is recognized.
   * @returns {boolean}
   */
  public isRecognized() {
    return !!this.options.firstUncategorizedTransaction?.recognizedTransaction;
  }

  /**
   * Retrieves the total amount of uncategorized transactions.
   * @returns {number}
   */
  public amount() {
    return sumBy(this.options.uncategorizedTransactions, 'amount');
  }

  /**
   * Retrieves the formatted total amount of uncategorized transactions.
   * @returns {string}
   */
  public formattedAmount() {
    return this.formatNumber(this.amount(), {
      currencyCode: 'USD',
      money: true,
    });
  }

  /**
   * Detarmines whether the transaction is deposit.
   * @returns {boolean}
   */
  public isDepositTransaction() {
    const amount = this.amount();

    return amount > 0;
  }

  /**
   * Detarmines whether the transaction is withdrawal.
   * @returns {boolean}
   */
  public isWithdrawalTransaction() {
    const amount = this.amount();

    return amount < 0;
  }

  /**
   *
   * @param {string}
   */
  public date() {
    return this.options.firstUncategorizedTransaction?.date || null;
  }

  /**
   * Retrieves the formatted date of uncategorized transaction.
   * @returns {string}
   */
  public formattedDate() {
    return this.formatDate(this.date());
  }

  /**
   *
   * @param {string}
   */
  public referenceNo() {
    return this.options.firstUncategorizedTransaction?.referenceNo || null;
  }

  /**
   *
   * @returns {number}
   */
  public creditAccountId() {
    return (
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.assignedAccountId || null
    );
  }

  /**
   *
   * @returns {number}
   */
  public debitAccountId() {
    return this.options.firstUncategorizedTransaction?.accountId || null;
  }

  /**
   * Retrieves the assigned category of recognized transaction, if is not recognized
   * returns the default transaction type depends on the transaction normal.
   * @returns {string}
   */
  public transactionType() {
    const assignedCategory =
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.assignedCategory;

    return (
      assignedCategory ||
      (this.isDepositTransaction() ? 'other_income' : 'other_expense')
    );
  }

  /**
   *
   * @returns {string}
   */
  public payee() {
    return (
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.assignedPayee || null
    );
  }

  /**
   *
   * @returns {string}
   */
  public memo() {
    return (
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.assignedMemo || null
    );
  }

  /**
   * Retrieves the rule id the transaction recongized by.
   * @returns {string}
   */
  public recognizedByRuleId() {
    return (
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.bankRuleId || null
    );
  }

  /**
   * Retrieves the rule name the transaction recongized by.
   * @returns {string}
   */
  public recognizedByRuleName() {
    return (
      this.options.firstUncategorizedTransaction?.recognizedTransaction
        ?.bankRule?.name || null
    );
  }
}
