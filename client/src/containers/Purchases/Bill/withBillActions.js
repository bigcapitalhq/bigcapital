import { connect } from 'react-redux';
import {
  submitBill,
  deleteBill,
  editBill,
  fetchBillsTable,
  fetchBill,
} from 'store/Bills/bills.actions';
import t from 'store/types';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitBill: (form) => dispatch(submitBill({ form })),
  requestFetchBill: (id) => dispatch(fetchBill({ id })),
  requestEditBill: (id, form) => dispatch(editBill( id, form )),
  requestDeleteBill: (id) => dispatch(deleteBill({ id })),
  requestFetchBillsTable: (query = {}) =>
    dispatch(fetchBillsTable({ query: { ...query } })),

  changeBillView: (id) =>
    dispatch({
      type: t.BILLS_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),

  addBillsTableQueries: (queries) =>
    dispatch({
      type: t.BILLS_TABLE_QUERIES_ADD,
      queries,
    }),
});

export default connect(null, mapDispatchToProps);
