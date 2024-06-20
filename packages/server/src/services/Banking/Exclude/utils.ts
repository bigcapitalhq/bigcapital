import { ServiceError } from '@/exceptions';
import UncategorizedCashflowTransaction from '@/models/UncategorizedCashflowTransaction';

const ERRORS = {
  TRANSACTION_ALREADY_CATEGORIZED: 'TRANSACTION_ALREADY_CATEGORIZED',
};

export const validateTransactionNotCategorized = (
  transaction: UncategorizedCashflowTransaction
) => {
  if (transaction.categorized) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
  }
};
