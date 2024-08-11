import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class GetPendingBankAccountTransactionTransformer extends Transformer {
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
    ];
  };

  /**
   * Exclude all attributes.
   * @returns {Array<string>}
   */
  public excludeAttributes = (): string[] => {
    return [];
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
}
