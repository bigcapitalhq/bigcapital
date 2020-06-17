import { connect } from 'react-redux';
import {
  fetchReceivableAgingSummary,
  receivableAgingSummaryRefresh,
} from 'store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  requestReceivableAgingSummary: (query) =>
    dispatch(fetchReceivableAgingSummary({ query })),
  toggleFilterReceivableAgingSummary: () =>
    dispatch({
      type: 'RECEIVABLE_AGING_SUMMARY_FILTER_TOGGLE',
    }),
  refreshReceivableAgingSummary: (refresh) =>
    dispatch(receivableAgingSummaryRefresh(refresh)),
});

export default connect(null, mapActionsToProps);
