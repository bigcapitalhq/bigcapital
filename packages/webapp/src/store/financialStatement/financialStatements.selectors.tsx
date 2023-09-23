// @ts-nocheck
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
};

export const purchasesByItemsFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('purchasesByItems')(state);
};

export const salesByItemsFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('salesByItems')(state);
};
export const inventoryValuationFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('inventoryValuation')(state);
};

export const customerBalanceSummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('customersBalanceSummary')(state);
};

export const vendorsBalanceSummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('vendorsBalanceSummary')(state);
};

export const customersTransactionsFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('customersTransactions')(state);
};

export const vendorsTransactionsFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('vendorsTransactions')(state);
};

export const cashFlowStatementFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('cashFlowStatement')(state);
};

export const inventoryItemDetailsDrawerFilter = (state) => {
  return filterDrawerByTypeSelector('inventoryItemDetails')(state);
};

export const realizedGainOrLossFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('realizedGainOrLoss')(state);
};

export const unrealizedGainOrLossFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('unrealizedGainOrLoss')(state);
};

export const projectProfitabilitySummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('projectProfitabilitySummary')(state);
};

export const salesTaxLiabilitySummaryFilterDrawerSelector = (state) => {
  return filterDrawerByTypeSelector('salesTaxLiabilitySummary')(state);
};

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

/**
 * Retrieve whether purchases by items display filter drawer.
 */
export const getPurchasesByItemsFilterDrawer = createSelector(
  purchasesByItemsFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether sales by items display filter drawer.
 */
export const getSalesByItemsFilterDrawer = createSelector(
  salesByItemsFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve whether sells by items display filter drawer.
 */
export const getInventoryValuationFilterDrawer = createSelector(
  inventoryValuationFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve customers balance summary filter drawer.
 */
export const getCustomersBalanceSummaryFilterDrawer = createSelector(
  customerBalanceSummaryFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);
/**
 * Retrieve vendors balance summary filter drawer.
 */
export const getVendorsBalanceSummaryFilterDrawer = createSelector(
  vendorsBalanceSummaryFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve customers transactions filter drawer.
 */
export const getCustomersTransactionsFilterDrawer = createSelector(
  customersTransactionsFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve vendors transactions filter drawer.
 */
export const getVendorsTransactionsFilterDrawer = createSelector(
  vendorsTransactionsFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve cash flow statement filter drawer.
 */
export const getCashFlowStatementFilterDrawer = createSelector(
  cashFlowStatementFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve inventory item details filter drawer.
 */
export const getInventoryItemDetailsFilterDrawer = createSelector(
  inventoryItemDetailsDrawerFilter,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve Realized Gain or Loss filter drawer.
 */
export const getRealizedGainOrLossFilterDrawer = createSelector(
  realizedGainOrLossFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);
/**
 * Retrieve Unrealized Gain or Loss filter drawer.
 */
export const getUnrealizedGainOrLossFilterDrawer = createSelector(
  unrealizedGainOrLossFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

export const getProjectProfitabilitySummaryFilterDrawer = createSelector(
  projectProfitabilitySummaryFilterDrawerSelector,
  (isOpen) => {
    return isOpen;
  },
);

/**
 * Retrieve sales tax liability summary filter drawer.
 */
export const getSalesTaxLiabilitySummaryFilterDrawer = createSelector(
  salesTaxLiabilitySummaryFilterDrawerSelector,
  (isOpen) => isOpen,
);
