import { chain, mapKeys } from 'lodash';

export const getTransactionsLockingSettingsSchema = (modules: string[]) => {
  const moduleSchema = {
    active: { type: 'boolean' },
    lock_to_date: { type: 'date' },
    unlock_from_date: { type: 'date' },
    unlock_to_date: { type: 'date' },
    lock_reason: { type: 'string' },
    unlock_reason: { type: 'string' },
  };
  return chain(modules)
    .map((module: string) => {
      return mapKeys(moduleSchema, (value, key: string) => `${module}.${key}`);
    })
    .flattenDeep()
    .reduce((result, value) => {
      return {
        ...result,
        ...value,
      };
    }, {})
    .value();
};
