import { createSelector } from 'reselect';
import type { RootState } from '@/store/reducers';

export const sheetByTypeSelector =
  (sheetType: string) => (state: RootState) => {
    return state.financialStatements[sheetType];
  };

export const filterDrawerByTypeSelector =
  (sheetType: string) => (state: RootState) => {
    return sheetByTypeSelector(sheetType)(state)?.displayFilterDrawer;
  };

export const balanceSheetFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('balanceSheet')(state);

export const profitLossSheetFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('profitLoss')(state);

export const generalLedgerFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('generalLedger')(state);

export const trialBalanceFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('trialBalance')(state);

export const journalFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('journal')(state);

export const ARAgingSummaryFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('ARAgingSummary')(state);

export const APAgingSummaryFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('APAgingSummary')(state);

export const purchasesByItemsFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('purchasesByItems')(state);

export const salesByItemsFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('salesByItems')(state);

export const inventoryValuationFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('inventoryValuation')(state);

export const customerBalanceSummaryFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('customersBalanceSummary')(state);

export const vendorsBalanceSummaryFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('vendorsBalanceSummary')(state);

export const customersTransactionsFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('customersTransactions')(state);

export const vendorsTransactionsFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('vendorsTransactions')(state);

export const cashFlowStatementFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('cashFlowStatement')(state);

export const inventoryItemDetailsDrawerFilter = (state: RootState) =>
  filterDrawerByTypeSelector('inventoryItemDetails')(state);

export const realizedGainOrLossFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('realizedGainOrLoss')(state);

export const unrealizedGainOrLossFilterDrawerSelector = (state: RootState) =>
  filterDrawerByTypeSelector('unrealizedGainOrLoss')(state);

export const salesTaxLiabilitySummaryFilterDrawerSelector = (
  state: RootState,
) => filterDrawerByTypeSelector('salesTaxLiabilitySummary')(state);

export const getBalanceSheetFilterDrawer = createSelector(
  balanceSheetFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getTrialBalanceSheetFilterDrawer = createSelector(
  trialBalanceFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getProfitLossFilterDrawer = createSelector(
  profitLossSheetFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getGeneralLedgerFilterDrawer = createSelector(
  generalLedgerFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getJournalFilterDrawer = createSelector(
  journalFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getARAgingSummaryFilterDrawer = createSelector(
  ARAgingSummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getAPAgingSummaryFilterDrawer = createSelector(
  APAgingSummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getFinancialSheetQueryFactory = (sheetType: string) =>
  createSelector(sheetByTypeSelector(sheetType), (sheet) => {
    return sheet && (sheet as any).query ? (sheet as any).query : {};
  });
export const getPurchasesByItemsFilterDrawer = createSelector(
  purchasesByItemsFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getSalesByItemsFilterDrawer = createSelector(
  salesByItemsFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getInventoryValuationFilterDrawer = createSelector(
  inventoryValuationFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getCustomersBalanceSummaryFilterDrawer = createSelector(
  customerBalanceSummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getVendorsBalanceSummaryFilterDrawer = createSelector(
  vendorsBalanceSummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getCustomersTransactionsFilterDrawer = createSelector(
  customersTransactionsFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getVendorsTransactionsFilterDrawer = createSelector(
  vendorsTransactionsFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getCashFlowStatementFilterDrawer = createSelector(
  cashFlowStatementFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getInventoryItemDetailsFilterDrawer = createSelector(
  inventoryItemDetailsDrawerFilter,
  (isOpen) => isOpen,
);
export const getRealizedGainOrLossFilterDrawer = createSelector(
  realizedGainOrLossFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getUnrealizedGainOrLossFilterDrawer = createSelector(
  unrealizedGainOrLossFilterDrawerSelector,
  (isOpen) => isOpen,
);
export const getSalesTaxLiabilitySummaryFilterDrawer = createSelector(
  salesTaxLiabilitySummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
