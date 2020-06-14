import { connect } from 'react-redux';
import { fetchReceivableAgingSummary } from 'store/financialStatement/financialStatements.actions';

const mapActionsToProps = (dispatch) => ({
  requestReceivableAgingSummary: (query) =>
    dispatch(fetchReceivableAgingSummary({ query })),
  toggleFilterReceivableAgingSummary: () => dispatch({
    type: 'RECEIVABLE_AGING_SUMMARY_FILTER_TOGGLE',
  }),
});

export default connect(null, mapActionsToProps);
