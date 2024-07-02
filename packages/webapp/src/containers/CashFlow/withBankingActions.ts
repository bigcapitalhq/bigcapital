import { connect } from 'react-redux';
import {
  closeMatchingTransactionAside,
  setUncategorizedTransactionIdForMatching,
} from '@/store/banking/banking.reducer';

export interface WithBankingActionsProps {
  closeMatchingTransactionAside: () => void;
  setUncategorizedTransactionIdForMatching: (
    uncategorizedTransactionId: number,
  ) => void;
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
});

export const withBankingActions = connect<
  null,
  WithBankingActionsProps,
  {},
  any
>(null, mapDipatchToProps);
