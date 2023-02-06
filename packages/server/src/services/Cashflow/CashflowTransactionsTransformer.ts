import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from 'utils';

export class CashflowTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  protected includeAttributes = (): string[] => {
    return ['deposit', 'withdrawal', 'formattedDeposit', 'formattedWithdrawal'];
  };

  /**
   * Exclude these attributes.
   * @returns {string[]}
   */
  protected excludeAttributes = (): string[] => {
    return [
      'credit',
      'debit',
      'index',
      'index_group',
      'item_id',
      'item_quantity',
      'contact_type',
      'contact_id',
    ];
  };

  /**
   * Deposit amount attribute.
   * @param transaction
   * @returns
   */
  protected deposit = (transaction) => {
    return transaction.debit;
  };

  /**
   * Withdrawal amount attribute.
   * @param transaction
   * @returns
   */
  protected withdrawal = (transaction) => {
    return transaction.credit;
  };

  /**
   * Formatted withdrawal amount.
   * @param transaction
   * @returns
   */
  protected formattedWithdrawal = (transaction) => {
    return formatNumber(transaction.credit, {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Formatted deposit account.
   * @param transaction
   * @returns
   */
  protected formattedDeposit = (transaction) => {
    return formatNumber(transaction.debit, {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  };
}
