import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
  openMatchingTransactionAside: boolean;
  uncategorizedTransactionIdForMatching: number | null;
}

export const PlaidSlice = createSlice({
  name: 'plaid',
  initialState: {
    plaidToken: '',
    openMatchingTransactionAside: false,
    uncategorizedTransactionIdForMatching: null,
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
  },
});

export const {
  setPlaidId,
  resetPlaidId,
  setUncategorizedTransactionIdForMatching,
  closeMatchingTransactionAside,
} = PlaidSlice.actions;

export const getPlaidToken = (state: any) => state.plaid.plaidToken;
