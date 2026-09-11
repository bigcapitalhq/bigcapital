import type {
  TransactionsLockingListResponse,
  TransactionsLockingMeta,
} from '@bigcapital/sdk-ts';

export const validateMoveToPartialLocking = (
  all: TransactionsLockingMeta,
): boolean => {
  return all.isEnabled;
};

export const validateMoveToFullLocking = (
  modules: TransactionsLockingMeta[],
): TransactionsLockingMeta[] => {
  return modules.filter((module) => module.isEnabled);
};

export interface TransactionsLockingViewItem {
  name: string;
  module: string;
  description: string;
  isEnabled: boolean;
  isPartialUnlock: boolean;
  lockToDate: string;
  lockReason: string;
  unlockFromDate: string;
  unlockToDate: string;
  unlockReason: string;
  partialUnlockReason: string;
}

export const transformItem = (
  item: TransactionsLockingMeta,
): TransactionsLockingViewItem => {
  return {
    name: item.formattedModule,
    module: item.module,
    description: item.description,
    isEnabled: item.isEnabled,
    isPartialUnlock: item.isPartialUnlock,
    lockToDate: item.formattedLockToDate,
    lockReason: item.lockReason,
    unlockFromDate: item.formattedUnlockFromDate,
    unlockToDate: item.formattedUnlockToDate,
    unlockReason: item.unlockReason,
    partialUnlockReason: item.partialUnlockReason,
  };
};

export interface TransactionsLockingViewList {
  all: TransactionsLockingViewItem;
  modules: TransactionsLockingViewItem[];
}

export const transformList = (
  res: TransactionsLockingListResponse,
): TransactionsLockingViewList => {
  return {
    all: transformItem(res.all),
    modules: res.modules.map((module) => transformItem(module)),
  };
};
