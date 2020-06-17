import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
  profitLossRefresh,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
  toggleProfitLossSheetFilter: () => dispatch({ type: 'PROFIT_LOSS_FILTER_TOGGLE' }),
  refreshProfitLossSheet: (refresh) => dispatch(profitLossRefresh(refresh)),
});

export default connect(null, mapDispatchToProps);