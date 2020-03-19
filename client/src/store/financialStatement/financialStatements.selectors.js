import {getObjectDiff} from 'utils';


// Balance Sheet.
export const getBalanceSheetByQuery = (balanceSheets, query) => {
  return balanceSheets.find(balanceSheet => {
    return getObjectDiff(query, balanceSheet.query).length === 0;
  });
};

export const getBalanceSheetIndexByQuery = (balanceSheets, query) => {
  return balanceSheets.findIndex((balanceSheet) => {
    return getObjectDiff(query, balanceSheet.query).length === 0;
  });
};

export const getBalanceSheetByIndex = (balanceSheets, sheetIndex) => {
  return balanceSheets[sheetIndex];
};

export const getBalanceSheetQuery = (balanceSheets, sheetIndex) => {
  if (typeof balanceSheets[sheetIndex] === 'object') {
    return balanceSheets[sheetIndex].query || {};
  }
  return {};
};

export const getBalanceSheetAssetsAccounts = (balanceSheets, sheetIndex) => {
  if (typeof balanceSheets[sheetIndex] === 'object') {
    return balanceSheets[sheetIndex].balances.assets.accounts || [];
  }
  return [];
};

export const getBalanceSheetLiabilitiesAccounts = (balanceSheets, sheetIndex) => {
  if (typeof balanceSheets[sheetIndex] === 'object') {
    return balanceSheets[sheetIndex].balances.liabilities_equity.accounts || [];
  }
  return [];
};

export const getBalanceSheetColumns = (balanceSheets, sheetIndex) => {
  if (typeof balanceSheets[sheetIndex] === 'object') {
    return balanceSheets[sheetIndex].columns;
  }
  return [];
};


// Trial Balance Sheet.
export const getTrialBalanceSheetIndex = (trialBalanceSheets, query) => {
  return trialBalanceSheets.find((trialBalanceSheet) => {
    return getObjectDiff(query, trialBalanceSheet.query).length === 0;
  });
};

export const getTrialBalanceAccounts = (trialBalanceSheets, sheetIndex) => {
  if (typeof trialBalanceSheets[sheetIndex] === 'object') {
    return trialBalanceSheets[sheetIndex].accounts;
  }
  return [];
};

export const getTrialBalanceQuery = (trialBalanceSheets, sheetIndex) => {
  if (typeof trialBalanceSheets[sheetIndex] === 'object') {
    return trialBalanceSheets[sheetIndex].query;
  }
  return [];
};

// Profit/Loss Sheet selectors.
export const getProfitLossSheetIndex = (profitLossSheets, query) => {
  return profitLossSheets.find((profitLossSheet) => {
    return getObjectDiff(query, profitLossSheet.query).length === 0;
  });
}

export const getProfitLossSheet = (profitLossSheets, index) => {
  return (typeof profitLossSheets[index] !== 'undefined') ? 
    profitLossSheets[index] : null;
};

export const getProfitLossSheetColumns = (profitLossSheets, index) => {
  const sheet = getProfitLossSheet(profitLossSheets, index);
  return (sheet) ? sheet.columns : [];
};

export const getProfitLossSheetAccounts = (profitLossSheets, index) => {
  const sheet = getProfitLossSheet(profitLossSheets, index);
  return (sheet) ? sheet.accounts : [];
};