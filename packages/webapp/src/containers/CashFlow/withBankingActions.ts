import { connect } from 'react-redux';
import {
  closeMatchingTransactionAside,
  setUncategorizedTransactionIdForMatching,
  openReconcileMatchingTransaction,
  closeReconcileMatchingTransaction,
} from '@/store/banking/banking.reducer';

export interface WithBankingActionsProps {
  closeMatchingTransactionAside: () => void;
  setUncategorizedTransactionIdForMatching: (
    uncategorizedTransactionId: number,
  ) => void;
  openReconcileMatchingTransaction: (pendingAmount: number) => void;
  closeReconcileMatchingTransaction: () => void;
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
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
