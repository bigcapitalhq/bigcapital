import { createSelector } from 'reselect';
import { camelCase } from 'lodash';

const transformSheetType = (sheetType) => {
  return camelCase(sheetType);
};

// Financial Statements selectors.
export const sheetByTypeSelector = (sheetType) => (state, props) => {
  const sheetName = transformSheetType(sheetType);
  return state.financialStatements[sheetName].sheet;
};

/**
 * Retrieve financial statement sheet by the given sheet index.
 * @param {array} sheets 
 * @param {number} index 
 */
export const getFinancialSheetFactory = (sheetType) => 
  createSelector(
    sheetByTypeSelector(sheetType),
    (sheet) => {
      return sheet;
    },
  );

/**
 * Retrieve financial statement columns by the given sheet index.
 * @param {array} sheets 
 * @param {number} index 
 */
export const getFinancialSheetColumnsFactory = (sheetType) => 
  createSelector(
    sheetByTypeSelector(sheetType),
    (sheet) => {
      return (sheet && sheet.columns) ? sheet.columns : [];    
    },
  );

/**
 * Retrieve financial statement query by the given sheet index.
 */
export const getFinancialSheetQueryFactory = (sheetType) =>
  createSelector(
    sheetByTypeSelector(sheetType),
    (sheet) => {
      return (sheet && sheet.query) ? sheet.query : {};
    },
  );

/**
 * Retrieve financial statement accounts by the given sheet index.
 */
export const getFinancialSheetAccountsFactory = (sheetType) => 
  createSelector(
    sheetByTypeSelector(sheetType),
    (sheet) => {
      return (sheet && sheet.accounts) ? sheet.accounts : []; 
    }
  );

/**
 * Retrieve financial statement table rows by the given sheet index.
 */
export const getFinancialSheetTableRowsFactory = (sheetType) => 
  createSelector(
    sheetByTypeSelector(sheetType),
    (sheet) => {
      return (sheet && sheet.tableRows) ? sheet.tableRows : []; 
    }
  );
