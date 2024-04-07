import { TransactionsLockingGroup } from '@/interfaces';
import { Inject, Service } from 'typedi';
import TransactionsLockingGuard from './TransactionsLockingGuard';

@Service()
export default class PurchasesTransactionLocking {
  @Inject()
  transactionLockingGuardService: TransactionsLockingGuard;

  /**
   * Validates the transaction locking of purchases services commands.
   * @param {number} tenantId
   * @param {Date} transactionDate
   */
  public transactionLockingGuard = async (tenantId: number, transactionDate: Date) => {
    this.transactionLockingGuardService.transactionsLockingGuard(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.Purchases,
    );
  };
}
