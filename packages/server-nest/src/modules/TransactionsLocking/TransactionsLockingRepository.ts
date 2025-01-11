import * as moment from 'moment';
import { isUndefined } from 'lodash';
import {
  ITransactionMeta,
  TransactionsLockingGroup,
  TransactionsLockingType,
} from './types/TransactionsLocking.types';
import { Inject, Injectable } from '@nestjs/common';
import { SettingsStore } from '../Settings/SettingsStore';
import { SETTINGS_PROVIDER } from '../Settings/Settings.types';

@Injectable()
export class TransactionsLockingRepository {
  constructor(
    @Inject(SETTINGS_PROVIDER) private readonly settingsStore: SettingsStore,
  ) {}

  /**
   * Save transactions locking settings
   * @param {string} lockingGroup - The group of the transactions locking
   * @param {ITransactionMeta} transactionlocking - The transactions locking settings
   */
  public async saveTransactionsLocking(
    lockingGroup: string = TransactionsLockingGroup.All,
    transactionlocking,
  ) {
    const group = `transactions-locking`;

    if (!isUndefined(transactionlocking.active)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.active`,
        value: transactionlocking.active,
      });
    }
    if (!isUndefined(transactionlocking.lockToDate)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.lock_to_date`,
        value: parseDate(transactionlocking.lockToDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockFromDate)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_from_date`,
        value: parseDate(transactionlocking.unlockFromDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockToDate)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_to_date`,
        value: parseDate(transactionlocking.unlockToDate),
      });
    }
    if (!isUndefined(transactionlocking.lockReason)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.lock_reason`,
        value: transactionlocking.lockReason,
      });
    }
    if (!isUndefined(transactionlocking.unlockReason)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_reason`,
        value: transactionlocking.unlockReason,
      });
    }
    if (!isUndefined(transactionlocking.partialUnlockReason)) {
      this.settingsStore.set({
        group,
        key: `${lockingGroup}.partial_unlock_reason`,
        value: transactionlocking.partialUnlockReason,
      });
    }
    await this.settingsStore.save();
  }

  /**
   * Get transactions locking settings
   * @param {string} lockingGroup - The group of the transactions locking
   * @returns {ITransactionMeta} - The transactions locking settings
   */
  public getTransactionsLocking(
    lockingGroup: string = TransactionsLockingGroup.All,
  ): ITransactionMeta {
    const group = `transactions-locking`;

    const isEnabled = this.settingsStore.get({
      group,
      key: `${lockingGroup}.active`,
    });
    const lockFromDate = this.settingsStore.get({
      group,
      key: `${lockingGroup}.lock_from_date`,
    });
    const lockToDate = this.settingsStore.get({
      group,
      key: `${lockingGroup}.lock_to_date`,
    });
    const unlockFromDate = this.settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_from_date`,
    });
    const unlockToDate = this.settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_to_date`,
    });
    const lockReason = this.settingsStore.get({
      group,
      key: `${lockingGroup}.lock_reason`,
    });
    const unlockReason = this.settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_reason`,
    });
    const partialUnlockReason = this.settingsStore.get({
      group,
      key: `${lockingGroup}.partial_unlock_reason`,
    });

    return {
      isEnabled,
      lockToDate: lockToDate || null,
      unlockFromDate: unlockFromDate || null,
      unlockToDate: unlockToDate || null,
      isPartialUnlock: Boolean(unlockToDate && unlockFromDate),
      lockReason: lockReason || '',
      unlockReason: unlockReason || '',
      partialUnlockReason: partialUnlockReason || '',
    };
  }

  /**
   * Get transactions locking type
   * @returns {string} - The transactions locking type
   */
  public getTransactionsLockingType() {
    const lockingType = this.settingsStore.get({
      group: 'transactions-locking',
      key: 'locking-type',
    });
    return lockingType || 'partial';
  }

  /**
   * Flag transactions locking type
   * @param {TransactionsLockingType} transactionsType - The transactions locking type
   */
  public flagTransactionsLockingType(
    transactionsType: TransactionsLockingType,
  ) {
    this.settingsStore.set({
      group: 'transactions-locking',
      key: 'locking-type',
      value: transactionsType,
    });
  }
}

export const parseDate = (date: string) => {
  return date ? moment(date).utcOffset(0).format('YYYY-MM-DD') : '';
};
