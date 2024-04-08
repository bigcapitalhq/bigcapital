import { TransactionsLockingGroup } from '@/interfaces';
import TransactionsLockingValidator from '@/services/TransactionsLocking/TransactionsLockingGuard';
import { Inject, Service } from 'typedi';

@Service()
export default class PurchasesTransactionsLocking {
  @Inject()
  transactionLockingValidator: TransactionsLockingValidator;

  /**
   * Validates the all and partial purchases transactions locking.
   * @param {number} tenantId
   * @param {Date} transactionDate
   * @throws {ServiceError(TRANSACTIONS_DATE_LOCKED)}
   */
  public transactionLockingGuard = (tenantId: number, transactionDate: Date) => {
    // Validates the all transcation locking.
    this.transactionLockingValidator.validateTransactionsLocking(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.Purchases,
    );
  };
}
