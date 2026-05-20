import { AP_AGING_SUMMARY, AR_AGING_SUMMARY, BALANCE_SHEET, CASH_FLOW_STATEMENT, CUSTOMERS_BALANCE_SUMMARY, CUSTOMERS_TRANSACTIONS, DISPLAY_FILTER_DRAWER_TOGGLE, GENERAL_LEDGER, INVENTORY_ITEM_DETAILS, INVENTORY_VALUATION, JOURNAL, PROFIT_LOSS, PROJECT_PROFITABILITY_SUMMARY, PURCHASES_BY_ITEMS, REALIZED_GAIN_OR_LOSS, SALES_BY_ITEMS, SALES_TAX_LIABILITY_SUMMARY, TRIAL_BALANCE_SHEET, UNREALIZED_GAIN_OR_LOSS, VENDORS_BALANCE_SUMMARY, VENDORS_TRANSACTIONS } from '@/store/types';;

export function toggleBalanceSheetFilterDrawer(toggle?: boolean) {
  return { type: `${BALANCE_SHEET}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleTrialBalanceSheetFilterDrawer(toggle?: boolean) {
  return { type: `${TRIAL_BALANCE_SHEET}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleJournalSheeetFilterDrawer(toggle?: boolean) {
  return { type: `${JOURNAL}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleProfitLossFilterDrawer(toggle?: boolean) {
  return { type: `${PROFIT_LOSS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleGeneralLedgerFilterDrawer(toggle?: boolean) {
  return { type: `${GENERAL_LEDGER}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleARAgingSummaryFilterDrawer(toggle?: boolean) {
  return { type: `${AR_AGING_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleAPAgingSummaryFilterDrawer(toggle?: boolean) {
  return { type: `${AP_AGING_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function togglePurchasesByItemsFilterDrawer(toggle?: boolean) {
  return { type: `${PURCHASES_BY_ITEMS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleSalesByItemsFilterDrawer(toggle?: boolean) {
  return { type: `${SALES_BY_ITEMS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleInventoryValuationFilterDrawer(toggle?: boolean) {
  return { type: `${INVENTORY_VALUATION}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleCustomersBalanceSummaryFilterDrawer(toggle?: boolean) {
  return { type: `${CUSTOMERS_BALANCE_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleVendorsBalanceSummaryFilterDrawer(toggle?: boolean) {
  return { type: `${VENDORS_BALANCE_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleCustomersTransactionsFilterDrawer(toggle?: boolean) {
  return { type: `${CUSTOMERS_TRANSACTIONS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleVendorsTransactionsFilterDrawer(toggle?: boolean) {
  return { type: `${VENDORS_TRANSACTIONS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleCashFlowStatementFilterDrawer(toggle?: boolean) {
  return { type: `${CASH_FLOW_STATEMENT}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleInventoryItemDetailsFilterDrawer(toggle?: boolean) {
  return { type: `${INVENTORY_ITEM_DETAILS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleRealizedGainOrLossFilterDrawer(toggle?: boolean) {
  return { type: `${REALIZED_GAIN_OR_LOSS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleUnrealizedGainOrLossFilterDrawer(toggle?: boolean) {
  return { type: `${UNREALIZED_GAIN_OR_LOSS}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleProjectProfitabilitySummaryFilterDrawer(toggle?: boolean) {
  return { type: `${PROJECT_PROFITABILITY_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
export function toggleSalesTaxLiabilitySummaryFilterDrawer(toggle?: boolean) {
  return { type: `${SALES_TAX_LIABILITY_SUMMARY}/${DISPLAY_FILTER_DRAWER_TOGGLE}`, payload: { toggle } };
}
