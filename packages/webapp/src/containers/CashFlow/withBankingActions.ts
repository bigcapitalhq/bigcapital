import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { ComponentType } from 'react';
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
  setUncategorizedTransactionsFilter,
  resetUncategorizedTranasctionsFilter,
} from '@/store/banking/banking.reducer';

export interface UncategorizedTransactionsFilter {
  fromDate?: string;
  toDate?: string;
}

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

  setUncategorizedTransactionsFilter: (
    filter: UncategorizedTransactionsFilter,
  ) => void;
  resetUncategorizedTranasctionsFilter: () => void;
}

const mapDipatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithBankingActionsProps => ({
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

  addTransactionsToCategorizeSelected: (id: string | number) =>
    dispatch(addTransactionsToCategorizeSelected({ id })),

  removeTransactionsToCategorizeSelected: (id: string | number) =>
    dispatch(removeTransactionsToCategorizeSelected({ id })),

  resetTransactionsToCategorizeSelected: () =>
    dispatch(resetTransactionsToCategorizeSelected()),

  enableMultipleCategorization: (enable: boolean) =>
    dispatch(enableMultipleCategorization({ enable })),

  setCategorizedTransactionsSelected: (ids: Array<string | number>) =>
    dispatch(setCategorizedTransactionsSelected({ ids })),

  resetCategorizedTransactionsSelected: () =>
    dispatch(resetCategorizedTransactionsSelected()),

  setUncategorizedTransactionsFilter: (
    filter: UncategorizedTransactionsFilter,
  ) => dispatch(setUncategorizedTransactionsFilter({ filter })),

  resetUncategorizedTranasctionsFilter: () =>
    dispatch(resetUncategorizedTranasctionsFilter()),
});

export function withBankingActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithBankingActionsProps>> {
  const Connected = connect(
    null,
    mapDipatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithBankingActionsProps>
  >;
}
