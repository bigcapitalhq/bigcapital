import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
  toggleProfitLossSheetFilter: () => dispatch({ type: 'PROFIT_LOSS_FILTER_TOGGLE' }),
});

export default connect(null, mapDispatchToProps);