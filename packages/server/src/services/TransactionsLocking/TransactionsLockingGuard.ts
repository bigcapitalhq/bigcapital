import { Service, Inject } from 'typedi';
import moment from 'moment';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { ServiceError, ServiceErrors } from '@/exceptions';
import { TransactionsLockingGroup } from '@/interfaces';
import TransactionsLockingRepository from './TransactionsLockingRepository';
import { ERRORS } from './constants';

@Service()
export default class TransactionsLockingGuard {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  transactionsLockingRepo: TransactionsLockingRepository;

  /**
   * Determines whether the transaction date between the locking date period.
   * @param {number} tenantId
   * @param {Date} transactionDate
   * @param {TransactionsLockingGroup} lockingGroup
   * @returns {boolean}
   */
  public isTransactionsLocking = (
    tenantId: number,
    transactionDate: Date,
    lockingGroup: string = TransactionsLockingGroup.All
  ): boolean => {
    const { isEnabled, unlockFromDate, unlockToDate, lockToDate } =
      this.transactionsLockingRepo.getTransactionsLocking(
        tenantId,
        lockingGroup
      );
    // Returns false anyway in case if the transaction locking is disabled.
    if (!isEnabled) return false;

    const inLockingDate = moment(transactionDate).isSameOrBefore(lockToDate);
    const inUnlockDate =
      unlockFromDate && unlockToDate
        ? moment(transactionDate).isSameOrAfter(unlockFromDate) &&
          moment(transactionDate).isSameOrBefore(unlockFromDate)
        : false;

    // Retruns true in case the transaction date between locking date
    // and not between unlocking date.
    return !!(isEnabled && inLockingDate && !inUnlockDate);
  };

  /**
   * Validates the transaction date between the locking date period
   * or throw service error.
   * @param {number} tenantId
   * @param {Date} transactionDate
   * @param {TransactionsLockingGroup} lockingGroup
   *
   * @throws {ServiceError}
   */
  public validateTransactionsLocking = (
    tenantId: number,
    transactionDate: Date,
    lockingGroup: TransactionsLockingGroup
  ) => {
    const isLocked = this.isTransactionsLocking(
      tenantId,
      transactionDate,
      lockingGroup
    );
    if (isLocked) {
      this.throwTransactionsLockError(tenantId, lockingGroup);
    }
  };

  /**
   * Throws transactions locking error.
   * @param {number} tenantId
   * @param {TransactionsLockingGroup} lockingGroup
   */
  public throwTransactionsLockError = (
    tenantId: number,
    lockingGroup: TransactionsLockingGroup
  ) => {
    const { lockToDate } = this.transactionsLockingRepo.getTransactionsLocking(
      tenantId,
      lockingGroup
    );
    throw new ServiceError(ERRORS.TRANSACTIONS_DATE_LOCKED, null, {
      lockedToDate: lockToDate,
      formattedLockedToDate: moment(lockToDate).format('YYYY/MM/DD'),
    });
  };

  /**
   * Validate the transaction locking of the given locking group and transaction date.
   * @param {number} tenantId -
   * @param {TransactionsLockingGroup} lockingGroup - transaction group
   * @param {Date} fromDate -
   */
  public transactionsLockingGuard = (
    tenantId: number,
    transactionDate: Date,
    moduleType: TransactionsLockingGroup
  ) => {
    const lockingType =
      this.transactionsLockingRepo.getTransactionsLockingType(tenantId);

    //
    if (lockingType === TransactionsLockingGroup.All) {
      return this.validateTransactionsLocking(
        tenantId,
        transactionDate,
        TransactionsLockingGroup.All
      );
    }
    //
    return this.validateTransactionsLocking(
      tenantId,
      transactionDate,
      moduleType
    );
  };
}
