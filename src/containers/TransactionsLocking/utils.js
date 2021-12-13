

export const validateMoveToPartialLocking = (all) => {
  return all.is_enabled;
}

export const validateMoveToFullLocking = (modules) => {
  return modules.filter((module) => module.is_enabled);
}