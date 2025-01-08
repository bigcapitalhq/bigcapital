import { TransactionsLockingGroup } from '../types/TransactionsLocking.types';
import { Injectable } from '@nestjs/common';
import { TransactionsLockingGuard } from './TransactionsLockingGuard';
import { MomentInput } from 'moment';

@Injectable()
export class PurchasesTransactionLockingGuard {
  constructor(
    private readonly transactionLockingGuardService: TransactionsLockingGuard,
  ) {}

  /**
   * Validates the transaction locking of purchases services commands.
   * @param {Date} transactionDate - The transaction date.
   */
  public transactionLockingGuard = async (
    transactionDate: MomentInput
  ) => {
    this.transactionLockingGuardService.transactionsLockingGuard(
      transactionDate,
      TransactionsLockingGroup.Purchases
    );
  };
}
