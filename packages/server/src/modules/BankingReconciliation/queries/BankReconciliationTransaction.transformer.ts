import { Transformer } from '@/modules/Transformer/Transformer';
import {
  getReconciliationDateLocale,
  getReconciliationTransactionTypeLabel,
} from '../reconciliation-localization';
import { IBankReconciliationTransactionRow } from '../types/BankingReconciliation.types';

export class BankReconciliationTransactionTransformer extends Transformer<IBankReconciliationTransactionRow> {
  /**
   * Include attributes.
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedDate',
      'formattedCredit',
      'formattedDebit',
      'transactionTypeLabel',
    ];
  };

  protected formattedDate(transaction: IBankReconciliationTransactionRow) {
    return this.formatDate(
      transaction.date,
      undefined,
      getReconciliationDateLocale(),
    );
  }

  protected transactionTypeLabel(
    transaction: IBankReconciliationTransactionRow,
  ) {
    return getReconciliationTransactionTypeLabel(
      this.context.i18n,
      transaction.referenceType,
      transaction.transactionType,
    );
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
