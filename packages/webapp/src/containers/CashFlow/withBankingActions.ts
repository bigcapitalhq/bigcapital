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
  addTransactionsToCategorizeSelected,
  removeTransactionsToCategorizeSelected,
  setCategorizedTransactionsSelected,
  resetCategorizedTransactionsSelected,
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
  addTransactionsToCategorizeSelected: (id: string | number) => void;
  removeTransactionsToCategorizeSelected: (id: string | number) => void;
  resetTransactionsToCategorizeSelected: () => void;

  enableMultipleCategorization: (enable: boolean) => void;

  setCategorizedTransactionsSelected: (ids: Array<string | number>) => void;
  resetCategorizedTransactionsSelected: () => void;
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
   * Adds selected transactions to categorize.
   * @param {string | number} id
   * @returns
   */
  addTransactionsToCategorizeSelected: (id: string | number) =>
    dispatch(addTransactionsToCategorizeSelected({ id })),

  /**
   * Removes the selected transactions.
   * @param {string | number} id
   * @returns
   */
  removeTransactionsToCategorizeSelected: (id: string | number) =>
    dispatch(removeTransactionsToCategorizeSelected({ id })),

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

  /**
   * Sets the selected ids of the categorized transactions.
   * @param {Array<string | number>} ids
   */
  setCategorizedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(setCategorizedTransactionsSelected({ ids })),

  /**
   * Resets the selected categorized transcations.
   */
  resetCategorizedTransactionsSelected: () =>
    dispatch(resetCategorizedTransactionsSelected()),
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
