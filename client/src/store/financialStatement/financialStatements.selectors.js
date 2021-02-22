import { createSelector } from 'reselect';

// Financial Statements selectors.
export const sheetByTypeSelector = (sheetType) => (state, props) => {
  return state.financialStatements[sheetType];
};

export const filterDrawerByTypeSelector = (sheetType) => (state) => {
  return sheetByTypeSelector(sheetType)(state)?.displayFilterDrawer;
};

export const balanceSheetFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('balanceSheet')(state);
};

export const profitLossSheetFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('profitLoss')(state);
};

export const generalLedgerFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('generalLedger')(state);
};

// Trial balance filter drawer selector.
export const trialBalanceFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('trialBalance')(state);
};

export const journalFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('journal')(state);
};

export const ARAgingSummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('ARAgingSummary')(state);
};

export const APAgingSummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('APAgingSummary')(state);
}


/**
 * Retrieve balance sheet filter drawer.
 */
export const getBalanceSheetFilterDrawer = createSelector(
  balanceSheetFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether trial balance sheet display filter drawer.
 */
export const getTrialBalanceSheetFilterDrawer = createSelector(
  trialBalanceFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve profit/loss filter drawer.
 */
export const getProfitLossFilterDrawer = createSelector(
  profitLossSheetFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether display general ledger (GL) filter drawer.
 */
export const getGeneralLedgerFilterDrawer = createSelector(
  generalLedgerFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether display journal sheet filter drawer.
 */
export const getJournalFilterDrawer = createSelector(
  journalFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether display AR aging summary drawer filter.
 */
export const getARAgingSummaryFilterDrawer = createSelector(
  ARAgingSummaryFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);


/**
 * Retrieve whether display AR aging summary drawer filter.
 */
export const getAPAgingSummaryFilterDrawer = createSelector(
  APAgingSummaryFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve financial statement query by the given sheet index.
 */
export const getFinancialSheetQueryFactory = (sheetType) =>
  createSelector(sheetByTypeSelector(sheetType), (sheet) => {
    return sheet && sheet.query ? sheet.query : {};
  });
