import { connect } from 'react-redux';
import {
  closeMatchingTransactionAside,
  setUncategorizedTransactionIdForMatching,
  openReconcileMatchingTransaction,
  closeReconcileMatchingTransaction,
  setUncategorizedTransactionsSelected,
  resetUncategorizedTransactionsSelected,
  resetExcludedTransactionsSelected,
  setExcludedTransactionsSelected,
  resetTransactionsToCategorizeSelected,
  setTransactionsToCategorizeSelected,
} from '@/store/banking/banking.reducer';

export interface WithBankingActionsProps {
  closeMatchingTransactionAside: () => void;
  setUncategorizedTransactionIdForMatching: (
    uncategorizedTransactionId: number,
  ) => void;
  openReconcileMatchingTransaction: (pendingAmount: number) => void;
  closeReconcileMatchingTransaction: () => void;

  setUncategorizedTransactionsSelected: (ids: Array<string | number>) => void;
  resetUncategorizedTransactionsSelected: () => void;

  setExcludedTransactionsSelected: (ids: Array<string | number>) => void;
  resetExcludedTransactionsSelected: () => void;

  setTransactionsToCategorizeSelected: (ids: Array<string | number>) => void;
  resetTransactionsToCategorizeSelected: () => void;
}

const mapDipatchToProps = (dispatch: any): WithBankingActionsProps => ({
  closeMatchingTransactionAside: () =>
    dispatch(closeMatchingTransactionAside()),
  setUncategorizedTransactionIdForMatching: (
    uncategorizedTransactionId: number,
  ) =>
    dispatch(
      setUncategorizedTransactionIdForMatching(uncategorizedTransactionId),
    ),
  openReconcileMatchingTransaction: (pendingAmount: number) =>
    dispatch(openReconcileMatchingTransaction({ pending: pendingAmount })),
  closeReconcileMatchingTransaction: () =>
    dispatch(closeReconcileMatchingTransaction()),

  setUncategorizedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(
      setUncategorizedTransactionsSelected({
        transactionIds: ids,
      }),
    ),
  resetUncategorizedTransactionsSelected: () =>
    dispatch(resetUncategorizedTransactionsSelected()),

  setExcludedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(
      setExcludedTransactionsSelected({
        ids,
      }),
    ),
  resetExcludedTransactionsSelected: () =>
    dispatch(resetExcludedTransactionsSelected()),

  setTransactionsToCategorizeSelected: (ids: Array<string | number>) =>
    dispatch(setTransactionsToCategorizeSelected({ ids })),
  resetTransactionsToCategorizeSelected: () =>
    dispatch(resetTransactionsToCategorizeSelected()),
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
