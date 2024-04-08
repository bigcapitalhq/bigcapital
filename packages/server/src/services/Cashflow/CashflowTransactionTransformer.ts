import { Transformer } from '@/lib/Transformer/Transformer';
import { formatNumber } from '../../utils';

export class CashflowTransactionTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {string[]}
   */
  public includeAttributes = (): string[] => {
    return ['formattedAmount', 'transactionTypeFormatted'];
  };

  /**
   * Formatted amount.
   * @param {} transaction
   * @returns {string}
   */
  protected formattedAmount = (transaction) => {
    return formatNumber(transaction.amount, {
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
    return this.context.i18n.__(transaction.transactionTypeFormatted);
  };
}
