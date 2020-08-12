import { connect } from 'react-redux';
import {
  submitEstimate,
  editEstimate,
  deleteEstimate,
  fetchEstimate,
  fetchEstimatesTable,
} from 'store/Estimate/estimates.actions';
import t from 'store/types';

const mapDipatchToProps = (dispatch) => ({
  requestSubmitEstimate: (form) => dispatch(submitEstimate({ form })),
  requsetFetchEstimate: (id) => dispatch(fetchEstimate({ id })),
  requestEditEstimate: (id, form) => dispatch(editEstimate(id, form)),
  requestFetchEstimatesTable: (query = {}) =>
    dispatch(fetchEstimatesTable({ query: { ...query } })),
  requestDeleteEstimate: (id) => dispatch(deleteEstimate({ id })),

  changeEstimateView: (id) =>
    dispatch({
      type: t.ESTIMATES_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addEstimatesTableQueries: (queries) =>
    dispatch({
      type: t.ESTIMATES_TABLE_QUERIES_ADD,
      queries,
    }),
});

export default connect(null, mapDipatchToProps);
