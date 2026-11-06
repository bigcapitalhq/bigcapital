import { Transformer } from '@/modules/Transformer/Transformer';
import { BankReconciliation } from '../models/BankReconciliation';
import { BANK_RECONCILIATION_STATUS_LABELS } from '../types/BankingReconciliation.types';

export class BankReconciliationTransformer extends Transformer<
  BankReconciliation & { transactionsCount?: number }
> {
  /**
   * Include attributes.
   */
  public includeAttributes = (): string[] => {
    return [
      'formattedStartDate',
      'formattedEndDate',
      'formattedBeginningBalance',
      'formattedEndingBalance',
      'formattedClearedBalance',
      'formattedDifference',
      'statusLabel',
      'isInProgress',
      'isReconciled',
      'isVoided',
      'transactionsCount',
    ];
  };

  /**
   * Exclude attributes.
   */
  public excludeAttributes = (): string[] => {
    return [
      'draftTransactions',
      'createdBy',
      'reconciledBy',
      'account',
      'transactions',
    ];
  };

  protected formattedStartDate(reconciliation: BankReconciliation): string {
    return this.formatDate(reconciliation.startDate);
  }

  protected formattedEndDate(reconciliation: BankReconciliation): string {
    return this.formatDate(reconciliation.endDate);
  }

  protected formattedBeginningBalance(
    reconciliation: BankReconciliation,
  ): string {
    return this.formatMoney(reconciliation.beginningBalance);
  }

  protected formattedEndingBalance(reconciliation: BankReconciliation): string {
    return reconciliation.endingBalance === null ||
      reconciliation.endingBalance === undefined
      ? ''
      : this.formatMoney(reconciliation.endingBalance);
  }

  protected formattedClearedBalance(
    reconciliation: BankReconciliation,
  ): string {
    return this.formatMoney(reconciliation.clearedBalance);
  }

  protected formattedDifference(reconciliation: BankReconciliation): string {
    return this.formatMoney(reconciliation.difference);
  }

  protected statusLabel(reconciliation: BankReconciliation): string {
    return BANK_RECONCILIATION_STATUS_LABELS[reconciliation.status] ?? '';
  }

  protected isInProgress(reconciliation: BankReconciliation): boolean {
    return reconciliation.status === 'in_progress';
  }

  protected isReconciled(reconciliation: BankReconciliation): boolean {
    return reconciliation.status === 'reconciled';
  }

  protected isVoided(reconciliation: BankReconciliation): boolean {
    return reconciliation.status === 'voided';
  }
}
