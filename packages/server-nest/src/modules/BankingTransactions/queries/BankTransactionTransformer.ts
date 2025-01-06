import { Transformer } from '../../Transformer/Transformer';

export class BankTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedAmount',
      'transactionTypeFormatted',
      'formattedDate',
      'formattedCreatedAt',
    ];
  };

  /**
   * Formatted amount.
   * @param {} transaction
   * @returns {string}
   */
  protected formattedAmount = (transaction) => {
    return this.formatNumber(transaction.amount, {
      currencyCode: transaction.currencyCode,
      excerptZero: true,
    });
  };

  /**
   * Formatted transaction type.
   * @param transaction
   * @returns {string}
   */
  protected transactionTypeFormatted = (transaction) => {
    return this.context.i18n.t(transaction.transactionType);
  };

  /**
   * Retrieve the formatted transaction date.
   * @param invoice
   * @returns {string}
   */
  protected formattedDate = (invoice): string => {
    return this.formatDate(invoice.date);
  };

  /**
   * Retrieve the formatted created at date.
   * @param invoice
   * @returns {string}
   */
  protected formattedCreatedAt = (invoice): string => {
    return this.formatDate(invoice.createdAt);
  };
}
