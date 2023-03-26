// @ts-nocheck
export const validateMoveToPartialLocking = (all) => {
  return all.is_enabled;
};

export const validateMoveToFullLocking = (modules) => {
  return modules.filter((module) => module.is_enabled);
};

export const transformItem = (item) => {
  return {
    name: item.formatted_module,
    module: item.module,
    description: item.description,
    isEnabled: item.is_enabled,
    isPartialUnlock: item.is_partial_unlock,
    lockToDate: item.formatted_lock_to_date,
    lockReason: item.lock_reason,
    unlockFromDate: item.formatted_unlock_from_date,
    unlockToDate: item.formatted_unlock_to_date,
    unlockReason: item.unlock_reason,
    partialUnlockReason: item.partial_unlock_reason,
  };
};

export const transformList = (res) => {
  return {
    all: transformItem(res.all),
    modules: res.modules.map((module) => transformItem(module)),
  };
};
