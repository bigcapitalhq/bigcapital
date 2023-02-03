import {
  ITransactionsLockingSchema,
  TransactionsLockingGroup,
} from '@/interfaces';

export const ERRORS = {
  TRANSACTIONS_DATE_LOCKED: 'TRANSACTIONS_DATE_LOCKED',
  TRANSACTION_LOCKING_PARTIAL: 'TRANSACTION_LOCKING_PARTIAL',
  TRANSACTION_LOCKING_ALL: 'TRANSACTION_LOCKING_ALL',
  TRANSACTIONS_LOCKING_MODULE_NOT_FOUND:
    'TRANSACTIONS_LOCKING_MODULE_NOT_FOUND',
};

export const TRANSACTIONS_LOCKING_SCHEMA = [
  {
    module: 'sales',
    formattedModule: 'transactions_locking.module.sales.label',
    description: 'transactions_locking.module.sales.desc',
  },
  {
    module: 'purchases',
    formattedModule: 'transactions_locking.module.purchases.label',
    description: 'transactions_locking.module.purchases.desc',
  },
  {
    module: 'financial',
    formattedModule: 'transactions_locking.module.financial.label',
    description: 'transactions_locking.module.financial.desc',
  },
] as ITransactionsLockingSchema[];

export function getTransactionsLockingSchemaMeta(
  module: TransactionsLockingGroup
): ITransactionsLockingSchema {
  return TRANSACTIONS_LOCKING_SCHEMA.find((schema) => schema.module === module);
}
