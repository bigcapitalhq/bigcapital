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
  enableMultipleCategorization,
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

  enableMultipleCategorization: (enable: boolean) => void;
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
   * Resets the excluded selected transactions.
   */
  resetExcludedTransactionsSelected: () =>
    dispatch(resetExcludedTransactionsSelected()),

  /**
   * Sets the selected transactions to categorize or match.
   * @param {Array<string | number>} ids
   */
  setTransactionsToCategorizeSelected: (ids: Array<string | number>) =>
    dispatch(setTransactionsToCategorizeSelected({ ids })),

  /**
   * Resets the selected transactions to categorize or match.
   */
  resetTransactionsToCategorizeSelected: () =>
    dispatch(resetTransactionsToCategorizeSelected()),

  /**
   * Enables/Disables the multiple selection to categorize or match.
   * @param {boolean} enable
   */
  enableMultipleCategorization: (enable: boolean) =>
    dispatch(enableMultipleCategorization({ enable })),
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
