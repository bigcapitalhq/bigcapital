import { connect } from 'react-redux';
import {
  fetchReceivableAgingSummary,
  receivableAgingSummaryRefresh,
} from 'store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  requestReceivableAgingSummary: (query) =>
    dispatch(fetchReceivableAgingSummary({ query })),
  toggleFilterARAgingSummary: () =>
    dispatch({
      type: 'RECEIVABLE_AGING_SUMMARY_FILTER_TOGGLE',
    }),
  refreshARAgingSummary: (refresh) =>
    dispatch(receivableAgingSummaryRefresh(refresh)),
});

export default connect(null, mapActionsToProps);
