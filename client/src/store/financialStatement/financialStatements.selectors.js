import {getObjectDiff} from 'utils';


// Financial Statements selectors.

/**
 * Retrieve financial statement sheet by the given query.
 * @param {array} sheets 
 * @param {object} query 
 */
export const getFinancialSheetIndexByQuery = (sheets, query) => {
  return sheets.findIndex(balanceSheet => (
    getObjectDiff(query, balanceSheet.query).length === 0
  ));
};

/**
 * Retrieve financial statement sheet by the given sheet index.
 * @param {array} sheets 
 * @param {number} index 
 */
export const getFinancialSheet = (sheets, index) => {
  return (typeof sheets[index] !== 'undefined') ? sheets[index] : null;
};

/**
 * Retrieve financial statement columns by the given sheet index.
 * @param {array} sheets 
 * @param {number} index 
 */
export const getFinancialSheetColumns = (sheets, index) => {
  const sheet = getFinancialSheet(sheets, index);
  return (sheet && sheet.columns) ? sheet.columns : [];
};

/**
 * Retrieve financial statement query by the given sheet index.
 * @param {array} sheets 
 * @param {number} index 
 */
export const getFinancialSheetQuery = (sheets, index) => {
  const sheet = getFinancialSheet(sheets, index);
  return (sheet && sheet.query) ? sheet.query : {};
};


export const getFinancialSheetAccounts = (sheets, index) => {
  const sheet = getFinancialSheet(sheets, index);
  return (sheet && sheet.accounts) ? sheet.accounts : []; 
};


export const getFinancialSheetTableRows = (sheets, index) => {
  const sheet = getFinancialSheet(sheets, index);
  return (sheet && sheet.tableRows) ? sheet.tableRows : []; 
};