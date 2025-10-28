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
import { SettingsApplicationService } from '../Settings/SettingsApplication.service';

@Injectable()
export class TransactionsLockingRepository {
  constructor(
    @Inject(SETTINGS_PROVIDER)
    private readonly settingsStore: () => SettingsStore,
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
    const settingsStore = await this.settingsStore();

    if (!isUndefined(transactionlocking.active)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.active`,
        value: transactionlocking.active,
      });
    }
    if (!isUndefined(transactionlocking.lockToDate)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.lock_to_date`,
        value: parseDate(transactionlocking.lockToDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockFromDate)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_from_date`,
        value: parseDate(transactionlocking.unlockFromDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockToDate)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_to_date`,
        value: parseDate(transactionlocking.unlockToDate),
      });
    }
    if (!isUndefined(transactionlocking.lockReason)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.lock_reason`,
        value: transactionlocking.lockReason,
      });
    }
    if (!isUndefined(transactionlocking.unlockReason)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.unlock_reason`,
        value: transactionlocking.unlockReason,
      });
    }
    if (!isUndefined(transactionlocking.partialUnlockReason)) {
      settingsStore.set({
        group,
        key: `${lockingGroup}.partial_unlock_reason`,
        value: transactionlocking.partialUnlockReason,
      });
    }
    await settingsStore.save();
  }

  /**
   * Get transactions locking settings
   * @param {string} lockingGroup - The group of the transactions locking
   * @returns {ITransactionMeta} - The transactions locking settings
   */
  public async getTransactionsLocking(
    lockingGroup: string = TransactionsLockingGroup.All,
  ): Promise<ITransactionMeta> {
    const group = `transactions-locking`;
    const settingsStore = await this.settingsStore();

    const isEnabled = settingsStore.get({
      group,
      key: `${lockingGroup}.active`,
    });
    const lockFromDate = settingsStore.get({
      group,
      key: `${lockingGroup}.lock_from_date`,
    });
    const lockToDate = settingsStore.get({
      group,
      key: `${lockingGroup}.lock_to_date`,
    });
    const unlockFromDate = settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_from_date`,
    });
    const unlockToDate = settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_to_date`,
    });
    const lockReason = settingsStore.get({
      group,
      key: `${lockingGroup}.lock_reason`,
    });
    const unlockReason = settingsStore.get({
      group,
      key: `${lockingGroup}.unlock_reason`,
    });
    const partialUnlockReason = settingsStore.get({
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
  public async getTransactionsLockingType() {
    const settingsStore = await this.settingsStore();

    const lockingType = settingsStore.get({
      group: 'transactions-locking',
      key: 'locking-type',
    });
    return lockingType || 'partial';
  }

  /**
   * Flag transactions locking type
   * @param {TransactionsLockingType} transactionsType - The transactions locking type
   */
  public async flagTransactionsLockingType(
    transactionsType: TransactionsLockingType,
  ) {
    const settingsStore = await this.settingsStore();

    settingsStore.set({
      group: 'transactions-locking',
      key: 'locking-type',
      value: transactionsType,
    });
    await settingsStore.save();
  }
}

export const parseDate = (date: string) => {
  return date ? moment(date).utcOffset(0).format('YYYY-MM-DD') : '';
};
