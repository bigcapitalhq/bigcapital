import { connect, MapStateToProps } from 'react-redux';
import type { MapState } from '@/containers/hoc.types';
import { ApplicationState } from '@/store/reducers';

export interface WithBankingProps {
  openMatchingTransactionAside: ApplicationState['plaid']['openMatchingTransactionAside'];
  selectedUncategorizedTransactionId: ApplicationState['plaid']['uncategorizedTransactionIdForMatching'];
  openReconcileMatchingTransaction: boolean;
  reconcileMatchingTransactionPendingAmount: ApplicationState['plaid']['openReconcileMatchingTransaction']['pending'];
  uncategorizedTransationsIdsSelected: ApplicationState['plaid']['uncategorizedTransactionsSelected'];
  excludedTransactionsIdsSelected: ApplicationState['plaid']['excludedTransactionsSelected'];
  enableMultipleCategorization: ApplicationState['plaid']['enableMultipleCategorization'];
  transactionsToCategorizeIdsSelected: ApplicationState['plaid']['transactionsToCategorizeSelected'];
  categorizedTransactionsSelected: ApplicationState['plaid']['categorizedTransactionsSelected'];
  uncategorizedTransactionsFilter: ApplicationState['plaid']['uncategorizedFilter'];
}

export function withBanking<Props = unknown>(
  mapState?: MapState<WithBankingProps, Props>,
) {
  const mapStateToProps: MapStateToProps<
    WithBankingProps,
    Props,
    ApplicationState
  > = (state, props) => {
    const mapped: WithBankingProps = {
      openMatchingTransactionAside: state.plaid.openMatchingTransactionAside,
      selectedUncategorizedTransactionId:
        state.plaid.uncategorizedTransactionIdForMatching,
      openReconcileMatchingTransaction:
        state.plaid.openReconcileMatchingTransaction.isOpen,
      reconcileMatchingTransactionPendingAmount:
        state.plaid.openReconcileMatchingTransaction.pending,
      uncategorizedTransationsIdsSelected:
        state.plaid.uncategorizedTransactionsSelected,
      excludedTransactionsIdsSelected: state.plaid.excludedTransactionsSelected,
      enableMultipleCategorization: state.plaid.enableMultipleCategorization,
      transactionsToCategorizeIdsSelected:
        state.plaid.transactionsToCategorizeSelected,
      categorizedTransactionsSelected:
        state.plaid.categorizedTransactionsSelected,
      uncategorizedTransactionsFilter: state.plaid.uncategorizedFilter,
    };
    return mapState
      ? (mapState(mapped, state, props) as WithBankingProps)
      : mapped;
  };
  return connect(mapStateToProps);
}
