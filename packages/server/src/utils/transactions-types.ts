import { TransactionTypes } from '@/data/TransactionTypes';

export const getTransactionTypeLabel = (transactionType: string) => {
  return TransactionTypes[transactionType];
};
