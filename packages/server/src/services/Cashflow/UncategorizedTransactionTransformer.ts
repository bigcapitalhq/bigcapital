import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class UncategorizedTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'formattedDate',
      'formattedDepositAmount',
      'formattedWithdrawalAmount',

      'assignedAccountId',
      'assignedAccountName',
      'assignedAccountCode',
      'assignedPayee',
      'assignedMemo',
      'assignedCategory',
      'assignedCategoryFormatted',
    ];
  };

  /**
   * Exclude all attributes.
   * @returns {Array<string>}
   */
  public excludeAttributes = (): string[] => {
    return ['recognizedTransaction'];
  };

  /**
   * Formattes the transaction date.
   * @param transaction
   * @returns {string}
   */
  public formattedDate(transaction) {
    return this.formatDate(transaction.date);
  }

  /**
   * Formatted amount.
   * @param transaction
   * @returns {string}
   */
  public formattedAmount(transaction) {
    return formatNumber(transaction.amount, {
      currencyCode: transaction.currencyCode,
    });
  }

  /**
   * Formatted deposit amount.
   * @param transaction
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
   * Formatted withdrawal amount.
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

  // --------------------------------------------------------
  // # Recgonized transaction
  // --------------------------------------------------------
  /**
   * Get the assigned account ID of the transaction.
   * @param {object} transaction
   * @returns {number}
   */
  public assignedAccountId(transaction: any): number {
    return transaction.recognizedTransaction?.assignedAccountId;
  }

  /**
   * Get the assigned account name of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedAccountName(transaction: any): string {
    return transaction.recognizedTransaction?.assignAccount?.name;
  }

  /**
   * Get the assigned account code of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedAccountCode(transaction: any): string {
    return transaction.recognizedTransaction?.assignAccount?.code;
  }

  /**
   * Get the assigned payee of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public getAssignedPayee(transaction: any): string {
    return transaction.recognizedTransaction?.assignedPayee;
  }

  /**
   * Get the assigned memo of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedMemo(transaction: any): string {
    return transaction.recognizedTransaction?.assignedMemo;
  }

  /**
   * Get the assigned category of the transaction.
   * @param {object} transaction
   * @returns {string}
   */
  public assignedCategory(transaction: any): string {
    return transaction.recognizedTransaction?.assignedCategory;
  }

  /**
   * Get the assigned formatted category.
   * @returns {string}
   */
  public assignedCategoryFormatted() {
    return 'Other Income';
  }
}
