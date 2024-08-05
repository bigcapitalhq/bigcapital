import { ServiceError } from '@/exceptions';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';

const ERRORS = {
  TRANSACTION_ALREADY_CATEGORIZED: 'TRANSACTION_ALREADY_CATEGORIZED',
  TRANSACTION_ALREADY_EXCLUDED: 'TRANSACTION_ALREADY_EXCLUDED',
  TRANSACTION_NOT_EXCLUDED: 'TRANSACTION_NOT_EXCLUDED',
};

export const validateTransactionNotCategorized = (
  transaction: UncategorizedCashflowTransaction
) => {
  if (transaction.categorized) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
  }
};

export const validateTransactionNotExcluded = (
  transaction: UncategorizedCashflowTransaction
) => {
  if (transaction.isExcluded) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_EXCLUDED);
  }
};

export const validateTransactionShouldBeExcluded = (
  transaction: UncategorizedCashflowTransaction
) => {
  if (!transaction.isExcluded) {
    throw new ServiceError(ERRORS.TRANSACTION_NOT_EXCLUDED);
  }
};
