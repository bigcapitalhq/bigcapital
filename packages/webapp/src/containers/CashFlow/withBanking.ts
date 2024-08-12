// @ts-nocheck

import { connect } from 'react-redux';

export const withBanking = (mapState) => {
  const mapStateToProps = (state, props) => {
    const mapped = {
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
    };
    return mapState ? mapState(mapped, state, props) : mapped;
  };
  return connect(mapStateToProps);
};
