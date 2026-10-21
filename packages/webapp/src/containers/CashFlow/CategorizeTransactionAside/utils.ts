import { useFormikContext } from 'formik';
import { round } from 'lodash';
import { useMemo } from 'react';
import { useMatchingTransactionBoot } from './MatchingTransactionBoot';
import { MatchingTransactionFormValues } from './types';

export const transformToReq = (
  values: MatchingTransactionFormValues,
  uncategorizedTransactions: Array<number>,
) => {
  const matchedTransactions = Object.entries(values.matched)
    .filter(([key, value]) => value)
    .map(([key]) => {
      const [referenceType, referenceId] = key.split('-');

      return { referenceType, referenceId: parseInt(referenceId, 10) };
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

/**
 * Days either side of the bank transaction date that candidate matches are
 * searched in by default.
 */
export const DEFAULT_MATCH_DATE_WINDOW_DAYS = 90;

/**
 * Date windows offered for narrowing the matching candidates. Zero disables
 * the window and searches the whole ledger.
 */
export const MATCH_DATE_WINDOW_OPTIONS = [
  { label: '\u00B1 30 days', value: 30 },
  { label: '\u00B1 90 days', value: 90 },
  { label: '\u00B1 6 months', value: 182 },
  { label: '\u00B1 1 year', value: 365 },
  { label: 'All time', value: 0 },
];
