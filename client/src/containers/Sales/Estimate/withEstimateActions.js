import { connect } from 'react-redux';
import {
  submitEstimate,
  editEstimate,
  deleteEstimate,
  fetchEstimate,
  fetchEstimatesTable,
  deliverEstimate,
  approveEstimate,
  rejectEstimate
} from 'store/Estimate/estimates.actions';
import t from 'store/types';

const mapDipatchToProps = (dispatch) => ({
  requestSubmitEstimate: (form) => dispatch(submitEstimate({ form })),
  requsetFetchEstimate: (id) => dispatch(fetchEstimate({ id })),
  requestEditEstimate: (id, form) => dispatch(editEstimate(id, form)),
  requestFetchEstimatesTable: (query = {}) =>
    dispatch(fetchEstimatesTable({ query: { ...query } })),
  requestDeleteEstimate: (id) => dispatch(deleteEstimate({ id })),
  requestDeliverdEstimate: (id) => dispatch(deliverEstimate({ id })),
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
});

export default connect(null, mapDipatchToProps);
