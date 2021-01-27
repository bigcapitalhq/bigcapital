import { connect } from 'react-redux';
import {
  submitVendor,
  editVendor,
  deleteVendor,
  fetchVendorsTable,
  fetchVendor,
} from 'store/vendors/vendors.actions';
import t from 'store/types';

const mapDispatchToProps = (dispatch) => ({
  requestSubmitVendor: (form) => dispatch(submitVendor({ form })),
  requestEditVendor: (id, form) => dispatch(editVendor({ id, form })),
  requestFetchVendor: (id) => dispatch(fetchVendor({ id })),
  requestFetchVendorsTable: (query = {}) =>
    dispatch(fetchVendorsTable({ query: { ...query } })),
  requestDeleteVender: (id) => dispatch(deleteVendor({ id })),
  changeVendorView: (id) =>
    dispatch({
      type: t.VENDORS_SET_CURRENT_VIEW,
      currentViewId: parseInt(id, 10),
    }),
  addVendorsTableQueries: (queries) =>
    dispatch({
      type: t.VENDORS_TABLE_QUERIES_ADD,
      payload: { queries },
    }),
  setSelectedRowsVendors: (selectedRows) =>
    dispatch({
      type: t.VENDOR_SELECTED_ROWS_SET,
      payload: { selectedRows },
    }),
});

export default connect(null, mapDispatchToProps);
