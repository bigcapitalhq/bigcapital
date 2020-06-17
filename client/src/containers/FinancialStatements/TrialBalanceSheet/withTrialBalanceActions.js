import {connect} from 'react-redux';
import {
  fetchTrialBalanceSheet,
  trialBalanceRefresh,
} from 'store/financialStatement/financialStatements.actions';

export const mapDispatchToProps = (dispatch) => ({
  fetchTrialBalanceSheet: (query = {}) => dispatch(fetchTrialBalanceSheet({ query })),
  toggleTrialBalanceFilter: () => dispatch({ type: 'TRIAL_BALANCE_FILTER_TOGGLE' }),
  refreshTrialBalance: (refresh) => dispatch(trialBalanceRefresh(refresh)),
});

export default connect(null, mapDispatchToProps);