// @ts-nocheck
import t from '@/store/types';

/**
 * Toggles display of the balance sheet filter drawer.
 * @param {boolean} toggle
 */
export function toggleBalanceSheetFilterDrawer(toggle) {
  return {
    type: `${t.BALANCE_SHEET}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the trial balance sheet filter drawer.
 * @param {boolean} toggle
 */
export function toggleTrialBalanceSheetFilterDrawer(toggle) {
  return {
    type: `${t.TRIAL_BALANCE_SHEET}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the journal sheet filter drawer.
 * @param {boolean} toggle
 */
export function toggleJournalSheetFilterDrawer(toggle) {
  return {
    type: `${t.JOURNAL}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the profit/loss filter drawer.
 * @param {boolean} toggle
 */
export function toggleProfitLossFilterDrawer(toggle) {
  return {
    type: `${t.PROFIT_LOSS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the general ledger filter drawer.
 * @param {boolean} toggle
 */
export function toggleGeneralLedgerFilterDrawer(toggle) {
  return {
    type: `${t.GENERAL_LEDGER}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the AR aging summary filter drawer.
 * @param {boolean} toggle -
 */
export function toggleARAgingSummaryFilterDrawer(toggle) {
  return {
    type: `${t.AR_AGING_SUMMARY}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the AP aging summary filter drawer.
 * @param {boolean} toggle -
 */
export function toggleAPAgingSummaryFilterDrawer(toggle) {
  return {
    type: `${t.AP_AGING_SUMMARY}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the purchases by items filter drawer.
 * @param {boolean} toggle
 */
export function togglePurchasesByItemsFilterDrawer(toggle) {
  return {
    type: `${t.PURCHASES_BY_ITEMS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the sells by items filter drawer.
 * @param {boolean} toggle
 */
export function toggleSalesByItemsFilterDrawer(toggle) {
  return {
    type: `${t.SALES_BY_ITEMS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}
/**
 * Toggles display of the inventory valuation filter drawer.
 * @param {boolean} toggle
 */
export function toggleInventoryValuationFilterDrawer(toggle) {
  return {
    type: `${t.INVENTORY_VALUATION}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the customers balance summary filter drawer.
 * @param {boolean} toggle
 */
export function toggleCustomersBalanceSummaryFilterDrawer(toggle) {
  return {
    type: `${t.CUSTOMERS_BALANCE_SUMMARY}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}
/**
 * Toggles display of the vendors balance summary filter drawer.
 * @param {boolean} toggle
 */
export function toggleVendorsBalanceSummaryFilterDrawer(toggle) {
  return {
    type: `${t.VENDORS_BALANCE_SUMMARY}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}
/**
 * Toggles display of the customers transactions filter drawer.
 * @param {boolean} toggle
 */
export function toggleCustomersTransactionsFilterDrawer(toggle) {
  return {
    type: `${t.CUSTOMERS_TRANSACTIONS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the vendors transactions filter drawer.
 * @param {boolean} toggle
 */
export function toggleVendorsTransactionsFilterDrawer(toggle) {
  return {
    type: `${t.VENDORS_TRANSACTIONS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 *  Toggle display of the cash flow statement filter drawer.
 * @param {boolean} toggle
 */
export function toggleCashFlowStatementFilterDrawer(toggle) {
  return {
    type: `${t.CASH_FLOW_STATEMENT}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggles display of the inventory item details filter drawer.
 * @param {boolean} toggle
 */
export function toggleInventoryItemDetailsFilterDrawer(toggle) {
  return {
    type: `${t.INVENTORY_ITEM_DETAILS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 *  Toggle display of the Realized Gain or Loss filter drawer.
 * @param {boolean} toggle
 */
export function toggleRealizedGainOrLossFilterDrawer(toggle) {
  return {
    type: `${t.REALIZED_GAIN_OR_LOSS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 *  Toggle display of the Unrealized Gain or Loss filter drawer.
 * @param {boolean} toggle
 */
export function toggleUnrealizedGainOrLossFilterDrawer(toggle) {
  return {
    type: `${t.UNREALIZED_GAIN_OR_LOSS}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}

/**
 * Toggle display of the project Profitability summary filter drawer.
 * @param {boolean} toggle
 */
export function toggleProjectProfitabilitySummaryFilterDrawer(toggle) {
  return {
    type: `${t.PROJECT_PROFITABILITY_SUMMARY}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle,
    },
  };
}
