import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getProfitLossSheetIndex,
  getProfitLossSheet,
  getProfitLossSheetColumns,
  getProfitLossSheetAccounts,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getProfitLossSheetIndex: (query) => getProfitLossSheetIndex(state.financialStatements.profitLossSheets, query),
  getProfitLossSheet: (index) => getProfitLossSheet(state.financialStatements.profitLossSheets, index),
  getProfitLossSheetColumns: (index) => getProfitLossSheetColumns(state.financialStatements.profitLossSheets, index),
  getProfitLossSheetAccounts: (index) => getProfitLossSheetAccounts(state.financialStatements.profitLossSheets, index),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);