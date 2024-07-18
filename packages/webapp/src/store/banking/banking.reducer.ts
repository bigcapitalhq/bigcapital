import { uniq } from 'lodash';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface StorePlaidState {
  plaidToken: string;
  openMatchingTransactionAside: boolean;
  uncategorizedTransactionIdForMatching: number | null;
  openReconcileMatchingTransaction: { isOpen: boolean; pending: number };

  uncategorizedTransactionsSelected: Array<number | string>;
  excludedTransactionsSelected: Array<number | string>;
  transactionsToCategorizeSelected: Array<number | string>;

  enableMultipleCategorization: boolean;
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
    transactionsToCategorizeSelected: [],
    enableMultipleCategorization: false,
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

    setUncategorizedTransactionsSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ transactionIds: Array<string | number> }>,
    ) => {
      state.uncategorizedTransactionsSelected = action.payload.transactionIds;
    },

    resetUncategorizedTransactionsSelected: (state: StorePlaidState) => {
      state.uncategorizedTransactionsSelected = [];
    },

    setExcludedTransactionsSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ ids: Array<string | number> }>,
    ) => {
      state.excludedTransactionsSelected = action.payload.ids;
    },

    resetExcludedTransactionsSelected: (state: StorePlaidState) => {
      state.excludedTransactionsSelected = [];
    },

    setTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ ids: Array<string | number> }>,
    ) => {
      state.transactionsToCategorizeSelected = action.payload.ids;
    },

    addTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ id: string | number }>,
    ) => {
      state.transactionsToCategorizeSelected = uniq([
        ...state.transactionsToCategorizeSelected,
        action.payload.id,
      ]);
    },

    removeTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ id: string | number }>,
    ) => {
      state.transactionsToCategorizeSelected =
        state.transactionsToCategorizeSelected.filter(
          (t) => t !== action.payload.id,
        );
    },

    resetTransactionsToCategorizeSelected: (state: StorePlaidState) => {
      state.transactionsToCategorizeSelected = [];
    },

    enableMultipleCategorization: (
      state: StorePlaidState,
      action: PayloadAction<{ enable: boolean }>,
    ) => {
      state.enableMultipleCategorization = action.payload.enable;
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
  setTransactionsToCategorizeSelected,
  addTransactionsToCategorizeSelected,
  removeTransactionsToCategorizeSelected,
  resetTransactionsToCategorizeSelected,
  enableMultipleCategorization,
} = PlaidSlice.actions;

export const getPlaidToken = (state: any) => state.plaid.plaidToken;
export const getTransactionsToCategorizeSelected = (state: any) =>
  state.plaid.transactionsToCategorizeSelected;

export const getOpenMatchingTransactionAside = (state: any) =>
  state.plaid.openMatchingTransactionAside;

export const isMultipleCategorization = (state: any) =>
  state.plaid.enableMultipleCategorization;
