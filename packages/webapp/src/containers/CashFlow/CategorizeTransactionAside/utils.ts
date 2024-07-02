import { useFormikContext } from 'formik';
import { MatchingTransactionFormValues } from './types';
import { useMatchingTransactionBoot } from './MatchingTransactionBoot';

export const transformToReq = (values: MatchingTransactionFormValues) => {
  const matchedTransactions = Object.entries(values.matched)
    .filter(([key, value]) => value)
    .map(([key]) => {
      const [reference_type, reference_id] = key.split('-');

      return { reference_type, reference_id: parseInt(reference_id, 10) };
    });

  return { matchedTransactions };
};

export const useGetPendingAmountMatched = () => {
  const { values } = useFormikContext<MatchingTransactionFormValues>();
  const { perfectMatches, possibleMatches } = useMatchingTransactionBoot();

  const matchedItems = [...perfectMatches, ...possibleMatches].filter(
    (match) => {
      const key = `${match.transactionType}-${match.transactionId}`;
      return values.matched[key];
    },
  );
  const totalMatchedAmount = matchedItems.reduce(
    (total, item) => total + parseFloat(item.amount),
    0,
  );
  const pendingAmount = 0 - totalMatchedAmount;

  return pendingAmount;
};
