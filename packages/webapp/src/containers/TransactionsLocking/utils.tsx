// @ts-nocheck
export const validateMoveToPartialLocking = (all) => {
  return all.isEnabled;
};

export const validateMoveToFullLocking = (modules) => {
  return modules.filter((module) => module.isEnabled);
};

export const transformItem = (item) => {
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

export const transformList = (res) => {
  return {
    all: transformItem(res.all),
    modules: res.modules.map((module) => transformItem(module)),
  };
};
