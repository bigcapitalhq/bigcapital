import t from 'store/types';

/**
 * Toggles display of the balance sheet filter drawer.
 * @param {boolean} toggle 
 */
export function toggleBalanceSheetFilterDrawer(toggle) {
  return {
    type: `${t.BALANCE_SHEET}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle
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
export function toggleJournalSheeetFilterDrawer(toggle) {
  return {
    type: `${t.JOURNAL}/${t.DISPLAY_FILTER_DRAWER_TOGGLE}`,
    payload: {
      toggle
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
      toggle
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
      toggle
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
    }
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
    }
  };
}