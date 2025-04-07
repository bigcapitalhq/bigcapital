import { Injectable } from '@nestjs/common';
import { MomentInput } from 'moment';
import { TransactionsLockingGroup } from '../types/TransactionsLocking.types';
import { TransactionsLockingGuard } from './TransactionsLockingGuard';

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
    await this.transactionLockingGuardService.transactionsLockingGuard(
      transactionDate,
      TransactionsLockingGroup.Purchases
    );
  };
}
