import { castArray, uniq } from 'lodash';
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

  categorizedTransactionsSelected: Array<number | string>;
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
    categorizedTransactionsSelected: [],
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

    /**
     * Sets the selected transactions to categorize or match.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ ids: Array<string | number> }>} action
     */
    setTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ ids: Array<string | number> }>,
    ) => {
      const ids = castArray(action.payload.ids);

      state.transactionsToCategorizeSelected = ids;
      state.openMatchingTransactionAside = true;
    },

    /**
     * Adds a transaction to selected transactions to categorize or match.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ id: string | number }>} action
     */
    addTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ id: string | number }>,
    ) => {
      state.transactionsToCategorizeSelected = uniq([
        ...state.transactionsToCategorizeSelected,
        action.payload.id,
      ]);
      state.openMatchingTransactionAside = true;
    },

    /**
     * Removes a transaction from the selected transactions to categorize or match.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ id: string | number }>} action
     */
    removeTransactionsToCategorizeSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ id: string | number }>,
    ) => {
      state.transactionsToCategorizeSelected =
        state.transactionsToCategorizeSelected.filter(
          (t) => t !== action.payload.id,
        );

      if (state.transactionsToCategorizeSelected.length === 0) {
        state.openMatchingTransactionAside = false;
      } else {
        state.openMatchingTransactionAside = true;
      }
    },

    /**
     * Resets the selected transactions to categorize or match.
     * @param {StorePlaidState} state
     */
    resetTransactionsToCategorizeSelected: (state: StorePlaidState) => {
      state.transactionsToCategorizeSelected = [];
      state.openMatchingTransactionAside = false;
    },

    /**
     * Enables/Disables the multiple selection to categorize or match.
     * @param {StorePlaidState} state
     * @param {PayloadAction<{ enable: boolean }>} action
     */
    enableMultipleCategorization: (
      state: StorePlaidState,
      action: PayloadAction<{ enable: boolean }>,
    ) => {
      state.enableMultipleCategorization = action.payload.enable;
    },

    /**
     * Sets the selected ids of the categorized transactions.
     * @param {StorePlaidState}
     * @param {PayloadAction<{ ids: Array<string | number> }>}
     */
    setCategorizedTransactionsSelected: (
      state: StorePlaidState,
      action: PayloadAction<{ ids: Array<string | number> }>,
    ) => {
      state.categorizedTransactionsSelected = action.payload.ids;
    },

    /**
     * Resets the selected categorized transcations.
     * @param {StorePlaidState}
     */
    resetCategorizedTransactionsSelected: (state: StorePlaidState) => {
      state.categorizedTransactionsSelected = [];
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
  setCategorizedTransactionsSelected,
  resetCategorizedTransactionsSelected,
} = PlaidSlice.actions;

export const getPlaidToken = (state: any) => state.plaid.plaidToken;
export const getTransactionsToCategorizeSelected = (state: any) =>
  state.plaid.transactionsToCategorizeSelected;

export const getOpenMatchingTransactionAside = (state: any) =>
  state.plaid.openMatchingTransactionAside;

export const isMultipleCategorization = (state: any) =>
  state.plaid.enableMultipleCategorization;

export const getTransactionsToCategorizeIdsSelected = (state: any) =>
  state.plaid.transactionsToCategorizeSelected;
