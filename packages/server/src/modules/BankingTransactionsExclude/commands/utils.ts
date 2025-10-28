import { UncategorizedBankTransaction } from "@/modules/BankingTransactions/models/UncategorizedBankTransaction";
import { ServiceError } from "@/modules/Items/ServiceError";

const ERRORS = {
  TRANSACTION_ALREADY_CATEGORIZED: 'TRANSACTION_ALREADY_CATEGORIZED',
  TRANSACTION_ALREADY_EXCLUDED: 'TRANSACTION_ALREADY_EXCLUDED',
  TRANSACTION_NOT_EXCLUDED: 'TRANSACTION_NOT_EXCLUDED',
};

export const validateTransactionNotCategorized = (
  transaction: UncategorizedBankTransaction
) => {
  if (transaction.categorized) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_CATEGORIZED);
  }
};

export const validateTransactionNotExcluded = (
  transaction: UncategorizedBankTransaction
) => {
  if (transaction.isExcluded) {
    throw new ServiceError(ERRORS.TRANSACTION_ALREADY_EXCLUDED);
  }
};

export const validateTransactionShouldBeExcluded = (
  transaction: UncategorizedBankTransaction
) => {
  if (!transaction.isExcluded) {
    throw new ServiceError(ERRORS.TRANSACTION_NOT_EXCLUDED);
  }
};
