import {connect} from 'react-redux';
import {
  fetchBalanceSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
  getFinancialSheetAccounts,
  getFinancialSheetColumns,
  getFinancialSheetQuery,
} from 'store/financialStatement/financialStatements.selectors';


export const mapStateToProps = (state, props) => ({
  getBalanceSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.balanceSheet.sheets, query),
  getBalanceSheet: (index) => getFinancialSheet(state.financialStatements.balanceSheet.sheets, index),
  getBalanceSheetAccounts: (index) => getFinancialSheetAccounts(state.financialStatements.balanceSheet.sheets, index),
  getBalanceSheetColumns:(index) => getFinancialSheetColumns(state.financialStatements.balanceSheet.sheets, index),
  getBalanceSheetQuery: (index) => getFinancialSheetQuery(state.financialStatements.balanceSheet.sheets, index),
  balanceSheetLoading: state.financialStatements.balanceSheet.loading,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchBalanceSheet: (query = {}) => dispatch(fetchBalanceSheet({ query })),  
});

export default connect(mapStateToProps, mapDispatchToProps);