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

  /**
   * Sets the selected uncategorized transactions.
   * @param {Array<string | number>} ids 
   */
  setUncategorizedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(
      setUncategorizedTransactionsSelected({
        transactionIds: ids,
      }),
    ),

  /**
   * Resets the selected uncategorized transactions.
   */
  resetUncategorizedTransactionsSelected: () =>
    dispatch(resetUncategorizedTransactionsSelected()),

  /**
   * Sets excluded selected transactions.
   * @param {Array<string | number>} ids
   */
  setExcludedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(
      setExcludedTransactionsSelected({
        ids,
      }),
    ),

  /**
   * Resets the excluded selected transactions
   */
  resetExcludedTransactionsSelected: () =>
    dispatch(resetExcludedTransactionsSelected()),
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
