import { Service, Inject } from 'typedi';
import TransactionsLockingValidator from '@/services/TransactionsLocking/TransactionsLockingGuard';
import { TransactionsLockingGroup } from '@/interfaces';

@Service()
export default class SalesTransactionsLocking {
  @Inject()
  transactionLockingValidator: TransactionsLockingValidator;

  /**
   * Validates the all and partial sales transactions locking.
   * @param {number} tenantId
   * @param {Date} transactionDate
   */
  public validateTransactionsLocking = (
    tenantId: number,
    transactionDate: Date
  ) => {
    // Validates the all transaction locking.
    this.transactionLockingValidator.validateTransactionsLocking(
      tenantId,
      transactionDate,
      TransactionsLockingGroup.All
    );
    // Validates the partial sales transaction locking.
    // this.transactionLockingValidator.validateTransactionsLocking(
    //   tenantId,
    //   transactionDate,
    //   TransactionsLockingGroup.Sales
    // );
  };
}
