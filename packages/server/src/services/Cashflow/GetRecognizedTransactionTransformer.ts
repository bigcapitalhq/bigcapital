import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class GetRecognizedTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale credit note object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'uncategorizedTransactionId',
      'referenceNo',
      'description',
      'payee',
      'amount',
      'formattedAmount',
      'date',
      'formattedDate',
      'assignedAccountId',
      'assignedAccountName',
      'assignedAccountCode',
      'assignedPayee',
      'assignedMemo',
      'assignedCategory',
      'assignedCategoryFormatted',
      'withdrawal',
      'deposit',
      'isDepositTransaction',
      'isWithdrawalTransaction',
      'formattedDepositAmount',
      'formattedWithdrawalAmount',
      'bankRuleId',
      'bankRuleName',
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
   * Get the uncategorized transaction id.
   * @param transaction 
   * @returns {number}
   */
  public uncategorizedTransactionId = (transaction): number => {
    return transaction.id; 
  }

  /**
   * Get the reference number of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public referenceNo(transaction: any): string {
    return transaction.referenceNo;
  }

  /**
   * Get the description of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public description(transaction: any): string {
    return transaction.description;
  }

  /**
   * Get the payee of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public payee(transaction: any): string {
    return transaction.payee;
  }

  /**
   * Get the amount of the transaction.
   * @param {object} transaction
   * @returns {number}
   */
  public amount(transaction: any): number {
    return transaction.amount;
  }

  /**
   * Get the formatted amount of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public formattedAmount(transaction: any): string {
    return this.formatNumber(transaction.formattedAmount, {
      money: true,
    });
  }

  /**
   * Get the date of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public date(transaction: any): string {
    return transaction.date;
  }

  /**
   * Get the formatted date of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public formattedDate(transaction: any): string {
    return this.formatDate(transaction.date);
  }

  /**
   * Get the assigned account ID of the transaction.
   * @param {object} transaction
   * @returns {number}
   */
  public assignedAccountId(transaction: any): number {
    return transaction.recognizedTransaction.assignedAccountId;
  }

  /**
   * Get the assigned account name of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedAccountName(transaction: any): string {
    return transaction.recognizedTransaction.assignAccount.name;
  }

  /**
   * Get the assigned account code of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedAccountCode(transaction: any): string {
    return transaction.recognizedTransaction.assignAccount.code;
  }

  /**
   * Get the assigned payee of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public getAssignedPayee(transaction: any): string {
    return transaction.recognizedTransaction.assignedPayee;
  }

  /**
   * Get the assigned memo of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedMemo(transaction: any): string {
    return transaction.recognizedTransaction.assignedMemo;
  }

  /**
   * Get the assigned category of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedCategory(transaction: any): string {
    return transaction.recognizedTransaction.assignedCategory;
  }

  /**
   * 
   * @returns {string}
   */
  public assignedCategoryFormatted() {
    return 'Other Income'
  }

  /**
   * Check if the transaction is a withdrawal.
   * @param {object} transaction
   * @returns {boolean}
   */
  public isWithdrawal(transaction: any): boolean {
    return transaction.withdrawal;
  }

  /**
   * Check if the transaction is a deposit.
   * @param {object} transaction
   * @returns {boolean}
   */
  public isDeposit(transaction: any): boolean {
    return transaction.deposit;
  }

  /**
   * Check if the transaction is a deposit transaction.
   * @param {object} transaction
   * @returns {boolean}
   */
  public isDepositTransaction(transaction: any): boolean {
    return transaction.isDepositTransaction;
  }

  /**
   * Check if the transaction is a withdrawal transaction.
   * @param {object} transaction
   * @returns {boolean}
   */
  public isWithdrawalTransaction(transaction: any): boolean {
    return transaction.isWithdrawalTransaction;
  }

  /**
   * Get formatted deposit amount.
   * @param {any} transaction
   * @returns {string}
   */
  protected formattedDepositAmount(transaction) {
    if (transaction.isDepositTransaction) {
      return formatNumber(transaction.deposit, {
        currencyCode: transaction.currencyCode,
      });
    }
    return '';
  }

  /**
   * Get formatted withdrawal amount.
   * @param transaction
   * @returns {string}
   */
  protected formattedWithdrawalAmount(transaction) {
    if (transaction.isWithdrawalTransaction) {
      return formatNumber(transaction.withdrawal, {
        currencyCode: transaction.currencyCode,
      });
    }
    return '';
  }

  /**
   * Get the transaction bank rule id.
   * @param transaction
   * @returns {string}
   */
  protected bankRuleId(transaction) {
    return transaction.recognizedTransaction.bankRuleId;
  }

  /**
   * Get the transaction bank rule name.
   * @param transaction
   * @returns {string}
   */
  protected bankRuleName(transaction) {
    return transaction.recognizedTransaction.bankRule.name;
  }
}
