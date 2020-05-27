import {connect} from 'react-redux';
import {
  fetchTrialBalanceSheet
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
  toggleTrialBalanceFilter: () => dispatch({ type: 'TRIAL_BALANCE_FILTER_TOGGLE' }),
});

export default connect(null, mapDispatchToProps);