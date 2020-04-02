import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
} from 'store/financialStatement/financialStatements.actions';
import {
  getFinancialSheetIndexByQuery,
  getFinancialSheet,
} from 'store/financialStatement/financialStatements.selectors';

export const mapStateToProps = (state, props) => ({
  getProfitLossSheetIndex: (query) => getFinancialSheetIndexByQuery(state.financialStatements.profitLoss.sheets, query),
  getProfitLossSheet: (index) => getFinancialSheet(state.financialStatements.profitLoss.sheets, index),
});

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
});

export default connect(mapStateToProps, mapDispatchToProps);