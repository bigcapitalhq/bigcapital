import {connect} from 'react-redux';
import {
  fetchProfitLossSheet,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfitLossSheet: (query = {}) => dispatch(fetchProfitLossSheet({ query })),
});

export default connect(null, mapDispatchToProps);