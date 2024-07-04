import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
  openMatchingTransactionAside: boolean;
  uncategorizedTransactionIdForMatching: number | null;
  openReconcileMatchingTransaction: boolean;
}

export const PlaidSlice = createSlice({
  name: 'plaid',
  initialState: {
    plaidToken: '',
    openMatchingTransactionAside: false,
    uncategorizedTransactionIdForMatching: null,
    openReconcileMatchingTransaction: false,
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

    openReconcileMatchingTransaction: (state: StorePlaidState) => {
      state.openReconcileMatchingTransaction = true;
    },

    closeReconcileMatchingTransaction: (state: StorePlaidState) => {
      state.openReconcileMatchingTransaction = false;
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
