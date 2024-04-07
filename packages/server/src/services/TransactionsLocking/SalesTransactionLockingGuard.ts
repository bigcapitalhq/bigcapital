import { TransactionsLockingGroup } from '@/interfaces';
import { Inject, Service } from 'typedi';
import TransactionsLockingGuard from './TransactionsLockingGuard';

@Service()
export default class SalesTransactionLocking {
  @Inject()
  transactionLockingGuardService: TransactionsLockingGuard;

  /**
   * Validates the transaction locking of sales services commands.
   * @param {number} tenantId
   * @param {Date} transactionDate
   */
  public transactionLockingGuard = async (tenantId: number, transactionDate: Date) => {
    await this.transactionLockingGuardService.transactionsLockingGuard(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.Sales,
    );
  };
}
