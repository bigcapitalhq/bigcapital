import { TransactionsLockingGroup } from '@/interfaces';
import TransactionsLockingValidator from '@/services/TransactionsLocking/TransactionsLockingGuard';
import { Inject, Service } from 'typedi';

@Service()
export default class SalesTransactionsLocking {
  @Inject()
  transactionLockingValidator: TransactionsLockingValidator;

  /**
   * Validates the all and partial sales transactions locking.
   * @param {number} tenantId
   * @param {Date} transactionDate
   */
  public validateTransactionsLocking = (tenantId: number, transactionDate: Date) => {
    // Validates the all transcation locking.
    this.transactionLockingValidator.validateTransactionsLocking(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.All,
    );
    // Validates the partial sales transcation locking.
    // this.transactionLockingValidator.validateTransactionsLocking(
    //   tenantId,
    //   transactionDate,
    //   TransactionsLockingGroup.Sales
    // );
  };
}
