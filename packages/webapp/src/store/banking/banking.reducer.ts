import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
  openMatchingTransactionAside: boolean;
  uncategorizedTransactionIdForMatching: number | null;
  openReconcileMatchingTransaction: { isOpen: boolean; pending: number };
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
  },
});

export const {
  setPlaidId,
  resetPlaidId,
  setUncategorizedTransactionIdForMatching,
  closeMatchingTransactionAside,
  openReconcileMatchingTransaction,
  closeReconcileMatchingTransaction,
} = PlaidSlice.actions;

export const getPlaidToken = (state: any) => state.plaid.plaidToken;
