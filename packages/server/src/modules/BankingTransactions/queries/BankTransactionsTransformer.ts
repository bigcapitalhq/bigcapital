import { Transformer } from "@/modules/Transformer/Transformer";

export class BankTransactionsTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['deposit', 'withdrawal', 'formattedDeposit', 'formattedWithdrawal'];
  };

  /**
   * Exclude these attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
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
    return this.formatNumber(transaction.credit, {
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
    return this.formatNumber(transaction.debit, {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  };
}
