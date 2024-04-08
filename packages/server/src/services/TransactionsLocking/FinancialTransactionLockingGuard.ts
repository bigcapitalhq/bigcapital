import { TransactionsLockingGroup } from '@/interfaces';
import { Inject, Service } from 'typedi';
import TransactionsLockingGuard from './TransactionsLockingGuard';

@Service()
export default class FinancialTransactionLocking {
  @Inject()
  transactionLockingGuardService: TransactionsLockingGuard;

  /**
   * Validates the transaction locking of cashflow command action.
   * @param {number} tenantId
   * @param {Date} transactionDate
   * @throws {ServiceError(TRANSACTIONS_DATE_LOCKED)}
   */
  public transactionLockingGuard = (tenantId: number, transactionDate: Date) => {
    this.transactionLockingGuardService.transactionsLockingGuard(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.Financial,
    );
  };
}
