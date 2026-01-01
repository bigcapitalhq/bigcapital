// @ts-nocheck
import { connect } from 'react-redux';
import {
  setVendorsTableState,
  resetVendorsTableState,
  setVendorsSelectedRows,
  resetVendorsSelectedRows,
} from '@/store/vendors/vendors.actions';

const mapDispatchToProps = (dispatch) => ({
  setVendorsTableState: (queries) => dispatch(setVendorsTableState(queries)),
  resetVendorsTableState: () => dispatch(resetVendorsTableState()),
  setVendorsSelectedRows: (selectedRows) =>
    dispatch(setVendorsSelectedRows(selectedRows)),
  resetVendorsSelectedRows: () => dispatch(resetVendorsSelectedRows()),
});

export const withVendorsActions = connect(null, mapDispatchToProps);
