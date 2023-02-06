import { Service, Inject } from 'typedi';
import { isUndefined } from 'lodash';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import {
  ITransactionMeta,
  TransactionsLockingGroup,
  TransactionsLockingType,
} from '@/interfaces';
import { parseDate } from 'utils';

@Service()
export default class TransactionsLockingRepository {
  @Inject()
  tenancy: HasTenancyService;

  async saveTransactionsLocking(
    tenantId: number,
    lockingGroup: string = TransactionsLockingGroup.All,
    transactionlocking
  ) {
    const settings = this.tenancy.settings(tenantId);
    const group = `transactions-locking`;

    if (!isUndefined(transactionlocking.active)) {
      settings.set({
        group,
        key: `${lockingGroup}.active`,
        value: transactionlocking.active,
      });
    }
    if (!isUndefined(transactionlocking.lockToDate)) {
      settings.set({
        group,
        key: `${lockingGroup}.lock_to_date`,
        value: parseDate(transactionlocking.lockToDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockFromDate)) {
      settings.set({
        group,
        key: `${lockingGroup}.unlock_from_date`,
        value: parseDate(transactionlocking.unlockFromDate),
      });
    }
    if (!isUndefined(transactionlocking.unlockToDate)) {
      settings.set({
        group,
        key: `${lockingGroup}.unlock_to_date`,
        value: parseDate(transactionlocking.unlockToDate),
      });
    }
    if (!isUndefined(transactionlocking.lockReason)) {
      settings.set({
        group,
        key: `${lockingGroup}.lock_reason`,
        value: transactionlocking.lockReason,
      });
    }
    if (!isUndefined(transactionlocking.unlockReason)) {
      settings.set({
        group,
        key: `${lockingGroup}.unlock_reason`,
        value: transactionlocking.unlockReason,
      });
    }
    if (!isUndefined(transactionlocking.partialUnlockReason)) {
      settings.set({
        group,
        key: `${lockingGroup}.partial_unlock_reason`,
        value: transactionlocking.partialUnlockReason,
      });
    }

    await settings.save();
  }

  getTransactionsLocking(
    tenantId: number,
    lockingGroup: string = TransactionsLockingGroup.All
  ): ITransactionMeta {
    const settings = this.tenancy.settings(tenantId);
    const group = `transactions-locking`;

    const isEnabled = settings.get({ group, key: `${lockingGroup}.active` });

    const lockFromDate = settings.get({
      group,
      key: `${lockingGroup}.lock_from_date`,
    });
    const lockToDate = settings.get({
      group,
      key: `${lockingGroup}.lock_to_date`,
    });

    const unlockFromDate = settings.get({
      group,
      key: `${lockingGroup}.unlock_from_date`,
    });
    const unlockToDate = settings.get({
      group,
      key: `${lockingGroup}.unlock_to_date`,
    });

    const lockReason = settings.get({
      group,
      key: `${lockingGroup}.lock_reason`,
    });
    const unlockReason = settings.get({
      group,
      key: `${lockingGroup}.unlock_reason`,
    });
    const partialUnlockReason = settings.get({
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

  getTransactionsLockingType(tenantId: number) {
    const settings = this.tenancy.settings(tenantId);

    const lockingType = settings.get({
      group: 'transactions-locking',
      key: 'locking-type',
    });
    return lockingType || 'partial';
  }

  flagTransactionsLockingType(
    tenantId: number,
    transactionsType: TransactionsLockingType
  ) {
    const settings = this.tenancy.settings(tenantId);

    settings.set({
      group: 'transactions-locking',
      key: 'locking-type',
      value: transactionsType,
    });
  }
}
