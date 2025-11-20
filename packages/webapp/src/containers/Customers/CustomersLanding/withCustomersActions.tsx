// @ts-nocheck
import { connect } from 'react-redux';
import {
  setCustomersTableState,
  resetCustomersTableState,
  setCustomersSelectedRows,
  resetCustomersSelectedRows,
} from '@/store/customers/customers.actions';

export const mapDispatchToProps = (dispatch) => ({
  setCustomersTableState: (state) => dispatch(setCustomersTableState(state)),
  resetCustomersTableState: () => dispatch(resetCustomersTableState()),
  setCustomersSelectedRows: (selectedRows) =>
    dispatch(setCustomersSelectedRows(selectedRows)),
  resetCustomersSelectedRows: () => dispatch(resetCustomersSelectedRows()),
});

export default connect(null, mapDispatchToProps);
