import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
  getFinancialSheetColumns,
  getFinancialSheetQuery,
  getFinancialSheetTableRows,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getProfitLossSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.profitLoss.sheets, query),
  getProfitLossSheet: (index) => getFinancialSheet(state.financialStatements.profitLoss.sheets, index),
  getProfitLossColumns: (index) => getFinancialSheetColumns(state.financialStatements.profitLoss.sheets, index),
  getProfitLossQuery: (index) => getFinancialSheetQuery(state.financialStatements.profitLoss.sheets, index),
  getProfitLossTableRows: (index) => getFinancialSheetTableRows(state.financialStatements.profitLoss.sheets, index),

  profitLossSheetLoading: state.financialStatements.profitLoss.loading,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);