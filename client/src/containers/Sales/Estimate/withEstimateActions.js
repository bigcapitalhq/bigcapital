import { connect } from 'react-redux';
import {
  submitEstimate,
  editEstimate,
  deleteEstimate,
  fetchEstimate,
  fetchEstimatesTable,
  deliverEstimate,
  approveEstimate,
  rejectEstimate,
} from 'store/Estimate/estimates.actions';
import t from 'store/types';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitEstimate: (form) => dispatch(submitEstimate({ form })),
  requestFetchEstimate: (id) => dispatch(fetchEstimate({ id })),
  requestEditEstimate: (id, form) => dispatch(editEstimate(id, form)),
  requestFetchEstimatesTable: (query = {}) =>
    dispatch(fetchEstimatesTable({ query: { ...query } })),
  requestDeleteEstimate: (id) => dispatch(deleteEstimate({ id })),
  requestDeliveredEstimate: (id) => dispatch(deliverEstimate({ id })),
  requestApproveEstimate: (id) => dispatch(approveEstimate({ id })),
  requestRejectEstimate: (id) => dispatch(rejectEstimate({ id })),

  changeEstimateView: (id) =>
    dispatch({
      type: t.ESTIMATES_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addEstimatesTableQueries: (queries) =>
    dispatch({
      type: t.ESTIMATES_TABLE_QUERIES_ADD,
      payload: { queries },
    }),
  setEstimateNumberChanged: (isChanged) =>
    dispatch({
      type: t.ESTIMATE_NUMBER_CHANGED,
      payload: { isChanged },
    }),
  setSelectedRowsEstimates: (selectedRows) =>
    dispatch({
      type: t.ESTIMATES_SELECTED_ROWS_SET,
      payload: { selectedRows },
    }),
});

export default connect(null, mapDispatchToProps);
