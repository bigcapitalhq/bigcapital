import { connect } from 'react-redux';
import {
  fetchPayableAginSummary,
  payableAgingSummaryRefresh,
} from 'store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  requestPayableAgingSummary: (query) =>
    dispatch(fetchPayableAginSummary({ query })),
  refreshAPAgingSummary: (refresh) =>
    dispatch(payableAgingSummaryRefresh(refresh)),
  toggleFilterAPAgingSummary: () =>
    dispatch({
      type: 'PAYABLE_AGING_SUMMARY_FILTER_TOGGLE',
    }),
});

export default connect(null, mapActionsToProps);
