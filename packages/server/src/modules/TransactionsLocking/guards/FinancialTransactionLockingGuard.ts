import { Inject, Injectable } from '@nestjs/common';
import { TransactionsLockingGroup } from '../types/TransactionsLocking.types';
import { TransactionsLockingGuard } from './TransactionsLockingGuard';

@Injectable()
export class FinancialTransactionLocking {
  constructor(
    public readonly transactionLockingGuardService: TransactionsLockingGuard,
  ) {}

  /**
   * Validates the transaction locking of cashflow command action.
   * @param {Date} transactionDate - The transaction date.
   * @throws {ServiceError(TRANSACTIONS_DATE_LOCKED)}
   */
  public transactionLockingGuard = async (transactionDate: Date) => {
    await this.transactionLockingGuardService.transactionsLockingGuard(
      transactionDate,
      TransactionsLockingGroup.Financial,
    );
  };
}
