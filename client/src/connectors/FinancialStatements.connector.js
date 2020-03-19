import {connect} from 'react-redux';
import {
  fetchGeneralLedger,
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getBalanceSheetByQuery,
  getBalanceSheetColumns,
  getBalanceSheetIndexByQuery,
  getBalanceSheetByIndex,
  getBalanceSheetAssetsAccounts,
  getBalanceSheetLiabilitiesAccounts,
  getBalanceSheetQuery,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  generalLedeger: state.financialStatements.generalLedger,
  balanceSheets: state.financialStatements.balanceSheets,

  getBalanceSheetByQuery: (query) => getBalanceSheetByQuery(state.financialStatements.balanceSheets, query),
  getBalanceSheetColumns: (sheetIndex) => getBalanceSheetColumns(state.financialStatements.balanceSheets, sheetIndex),
  getBalanceSheetIndexByQuery: (query) => getBalanceSheetIndexByQuery(state.financialStatements.balanceSheets, query),
  getBalanceSheetByIndex: (sheetIndex) => getBalanceSheetByIndex(state.financialStatements.balanceSheets, sheetIndex),

  getBalanceSheetAssetsAccounts: (sheetIndex) => getBalanceSheetAssetsAccounts(state.financialStatements.balanceSheets, sheetIndex),
  getBalanceSheetLiabilitiesAccounts: (sheetIndex) => getBalanceSheetLiabilitiesAccounts(state.financialStatements.balanceSheets, sheetIndex),

  getBalanceSheetQuery: (sheetIndex) => getBalanceSheetQuery(state.financialStatements.balanceSheets, sheetIndex),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchGeneralLedger: (query = {}) => dispatch(fetchGeneralLedger({ query })),
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);