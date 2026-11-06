import { Transformer } from '@/modules/Transformer/Transformer';
import { IBankReconciliationTransactionRow } from '../types/BankingReconciliation.types';

export class BankReconciliationTransactionTransformer extends Transformer<IBankReconciliationTransactionRow> {
  /**
   * Include attributes.
   */
  public includeAttributes = (): string[] => {
    return ['formattedDate', 'formattedCredit', 'formattedDebit'];
  };

  protected formattedDate(transaction: IBankReconciliationTransactionRow) {
    return this.formatDate(transaction.date);
  }

  protected formattedCredit(transaction: IBankReconciliationTransactionRow) {
    return this.formatNumber(transaction.credit, {
      currencyCode: transaction.currencyCode,
    });
  }

  protected formattedDebit(transaction: IBankReconciliationTransactionRow) {
    return this.formatNumber(transaction.debit, {
      currencyCode: transaction.currencyCode,
    });
  }
}
