import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { round } from 'lodash';
import { MatchingTransactionFormValues } from './types';
import { useMatchingTransactionBoot } from './MatchingTransactionBoot';

export const transformToReq = (
  values: MatchingTransactionFormValues,
  uncategorizedTransactions: Array<number>,
) => {
  const matchedTransactions = Object.entries(values.matched)
    .filter(([key, value]) => value)
    .map(([key]) => {
      const [reference_type, reference_id] = key.split('-');

      return { reference_type, reference_id: parseInt(reference_id, 10) };
    });
  return { matchedTransactions, uncategorizedTransactions };
};

export const useGetPendingAmountMatched = () => {
  const { values } = useFormikContext<MatchingTransactionFormValues>();
  const { perfectMatches, possibleMatches, totalPending } =
    useMatchingTransactionBoot();

  return useMemo(() => {
    const matchedItems = [...perfectMatches, ...possibleMatches].filter(
      (match) => {
        const key = `${match.referenceType}-${match.referenceId}`;
        return values.matched[key];
      },
    );
    const totalMatchedAmount = matchedItems.reduce(
      (total, item) =>
        total +
        (item.transactionNormal === 'debit' ? 1 : -1) * parseFloat(item.amount),
      0,
    );
    const pendingAmount = totalPending - totalMatchedAmount;

    return round(pendingAmount, 2);
  }, [totalPending, perfectMatches, possibleMatches, values]);
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
