import {connect} from 'react-redux';
import {
  fetchTrialBalanceSheet
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
});

export default connect(null, mapDispatchToProps);