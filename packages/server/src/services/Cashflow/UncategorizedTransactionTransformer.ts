import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '@/utils';

export class UncategorizedTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['formattetDepositAmount', 'formattedWithdrawalAmount'];
  };

  /**
   * Formatted deposit amount.
   * @param transaction
   * @returns {string}
   */
  protected formattetDepositAmount(transaction) {
    return formatNumber(transaction.deposit, {
      currencyCode: transaction.currencyCode,
    });
  }

  /**
   * Formatted withdrawal amount.
   * @param transaction
   * @returns {string}
   */
  protected formattedWithdrawalAmount(transaction) {
    return formatNumber(transaction.withdrawal, {
      currencyCode: transaction.currencyCode,
    });
  }
}
