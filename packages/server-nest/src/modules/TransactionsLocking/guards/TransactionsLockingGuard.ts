import moment, { MomentInput } from 'moment';
import { Injectable } from '@nestjs/common';
import { TransactionsLockingGroup } from '../types/TransactionsLocking.types';
import { TransactionsLockingRepository } from '../TransactionsLockingRepository';
import { ERRORS } from '../constants';
import { ServiceError } from '@/modules/Items/ServiceError';

@Injectable()
export class TransactionsLockingGuard {
  constructor(
    private readonly transactionsLockingRepo: TransactionsLockingRepository,
  ) {}

  /**
   * Detarmines whether the transaction date between the locking date period.
   * @param {Date} transactionDate - The transaction date.
   * @param {TransactionsLockingGroup} lockingGroup - The transaction group.
   * @returns {boolean}
   */
  public isTransactionsLocking = (
    transactionDate: MomentInput,
    lockingGroup: string = TransactionsLockingGroup.All
  ): boolean => {
    const { isEnabled, unlockFromDate, unlockToDate, lockToDate } =
      this.transactionsLockingRepo.getTransactionsLocking(
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
   * @param {Date} transactionDate - The transaction date.
   * @param {TransactionsLockingGroup} lockingGroup - The transaction group.
   *
   * @throws {ServiceError}
   */
  public validateTransactionsLocking = (
    transactionDate: MomentInput,
    lockingGroup: TransactionsLockingGroup
  ) => {
    const isLocked = this.isTransactionsLocking(
      transactionDate,
      lockingGroup
    );
    if (isLocked) {
      this.throwTransactionsLockError(lockingGroup);
    }
  };

  /**
   * Throws transactions locking error.
   * @param {TransactionsLockingGroup} lockingGroup - The transaction group.
   */
  public throwTransactionsLockError = (
    lockingGroup: TransactionsLockingGroup
  ) => {
    const { lockToDate } = this.transactionsLockingRepo.getTransactionsLocking(
      lockingGroup
    );
    throw new ServiceError(ERRORS.TRANSACTIONS_DATE_LOCKED, null, {
      lockedToDate: lockToDate,
      formattedLockedToDate: moment(lockToDate).format('YYYY/MM/DD'),
    });
  };

  /**
   * Validate the transaction locking of the given locking group and transaction date.
   * @param {TransactionsLockingGroup} lockingGroup - The transaction group.
   * @param {Date} transactionDate - The transaction date.
   */
  public transactionsLockingGuard = (
    transactionDate: MomentInput,
    moduleType: TransactionsLockingGroup
  ) => {
    const lockingType =
      this.transactionsLockingRepo.getTransactionsLockingType();

    //
    if (lockingType === TransactionsLockingGroup.All) {
      return this.validateTransactionsLocking(
        transactionDate,
        TransactionsLockingGroup.All
      );
    }
    //
    return this.validateTransactionsLocking(
      transactionDate,
      moduleType
    );
  };
}
