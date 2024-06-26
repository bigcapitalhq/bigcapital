import { MatchingTransactionFormValues } from './types';

export const transformToReq = (values: MatchingTransactionFormValues) => {
  const matchedTransactions = Object.entries(values.matched)
    .filter(([key, value]) => value)
    .map(([key]) => {
      const [reference_type, reference_id] = key.split('-');

      return { reference_type, reference_id: parseInt(reference_id, 10) };
    });

  return { matchedTransactions };
};
