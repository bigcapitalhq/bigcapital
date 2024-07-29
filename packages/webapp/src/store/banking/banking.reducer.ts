import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
  openMatchingTransactionAside: boolean;
  uncategorizedTransactionIdForMatching: number | null;
  openReconcileMatchingTransaction: { isOpen: boolean; pending: number };

  uncategorizedTransactionsSelected: Array<number | string>;
  excludedTransactionsSelected: Array<number | string>;
}

export const PlaidSlice = createSlice({
  name: 'plaid',
  initialState: {
    plaidToken: '',
    openMatchingTransactionAside: false,
    uncategorizedTransactionIdForMatching: null,
    openReconcileMatchingTransaction: {
      isOpen: false,
      pending: 0,
    },
    uncategorizedTransactionsSelected: [],
    excludedTransactionsSelected: [],
  } as StorePlaidState,
  reducers: {
    setPlaidId: (state: StorePlaidState, action: PayloadAction<string>) => {
      state.plaidToken = action.payload;
    },

    resetPlaidId: (state: StorePlaidState) => {
      state.plaidToken = '';
    },

    setUncategorizedTransactionIdForMatching: (
      state: StorePlaidState,
      action: PayloadAction<number>,
    ) => {
      state.openMatchingTransactionAside = true;
      state.uncategorizedTransactionIdForMatching = action.payload;
    },

    closeMatchingTransactionAside: (state: StorePlaidState) => {
      state.openMatchingTransactionAside = false;
      state.uncategorizedTransactionIdForMatching = null;
    },

    openReconcileMatchingTransaction: (
      state: StorePlaidState,
      action: PayloadAction<{ pending: number }>,
    ) => {
      state.openReconcileMatchingTransaction.isOpen = true;
      state.openReconcileMatchingTransaction.pending = action.payload.pending;
    },

    closeReconcileMatchingTransaction: (state: StorePlaidState) => {
      state.openReconcileMatchingTransaction.isOpen = false;
      state.openReconcileMatchingTransaction.pending = 0;
    },

    /**
     * Sets the selected uncategorized transactions.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ transactionIds: Array<string | number> }>} action
     */
    setUncategorizedTransactionsSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ transactionIds: Array<string | number> }>,
    ) => {
      state.uncategorizedTransactionsSelected = action.payload.transactionIds;
    },

    /**
     * Resets the selected uncategorized transactions.
     * @param {StorePlaidState} state
     */
    resetUncategorizedTransactionsSelected: (state: StorePlaidState) => {
      state.uncategorizedTransactionsSelected = [];
    },

    /**
     * Sets excluded selected transactions.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ ids: Array<string | number> }>} action
     */
    setExcludedTransactionsSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ ids: Array<string | number> }>,
    ) => {
      state.excludedTransactionsSelected = action.payload.ids;
    },

    /**
     * Resets the excluded selected transactions
     * @param {StorePlaidState} state
     */
    resetExcludedTransactionsSelected: (state: StorePlaidState) => {
      state.excludedTransactionsSelected = [];
    },
  },
});

export const {
  setPlaidId,
  resetPlaidId,
  setUncategorizedTransactionIdForMatching,
  closeMatchingTransactionAside,
  openReconcileMatchingTransaction,
  closeReconcileMatchingTransaction,
  setUncategorizedTransactionsSelected,
  resetUncategorizedTransactionsSelected,
  setExcludedTransactionsSelected,
  resetExcludedTransactionsSelected,
} = PlaidSlice.actions;

export const getPlaidToken = (state: any) => state.plaid.plaidToken;
