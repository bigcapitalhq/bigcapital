import { useFormikContext } from 'formik';
import { MatchingTransactionFormValues } from './types';
import { useMatchingTransactionBoot } from './MatchingTransactionBoot';
import { useCategorizeTransactionTabsBoot } from './CategorizeTransactionTabsBoot';
import { useMemo } from 'react';

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
  const { uncategorizedTransaction } = useCategorizeTransactionTabsBoot();

  return useMemo(() => {
    const matchedItems = [...perfectMatches, ...possibleMatches].filter(
      (match) => {
        const key = `${match.referenceType}-${match.referenceId}`;
        return values.matched[key];
      },
    );
    const totalMatchedAmount = matchedItems.reduce(
      (total, item) => total + parseFloat(item.amount),
      0,
    );
    const amount = uncategorizedTransaction.amount;
    const pendingAmount = amount - totalMatchedAmount;

    return pendingAmount;
  }, [uncategorizedTransaction, perfectMatches, possibleMatches, values]);
};

export const useAtleastOneMatchedSelected = () => {
  const { values } = useFormikContext<MatchingTransactionFormValues>();

  return useMemo(() => {
    const matchedCount = Object.values(values.matched).filter(Boolean).length;
    return matchedCount > 0;
  }, [values]);
};

export const useIsShowReconcileTransactionLink = () => {
  const pendingAmount = useGetPendingAmountMatched();
  const atleastOneSelected = useAtleastOneMatchedSelected();

  return atleastOneSelected && pendingAmount !== 0;
};
