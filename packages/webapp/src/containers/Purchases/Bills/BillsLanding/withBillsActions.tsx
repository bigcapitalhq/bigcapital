// @ts-nocheck
import { connect } from 'react-redux';
import {
  setBillsTableState,
  resetBillsTableState,
  setBillsSelectedRows,
} from '@/store/Bills/bills.actions';

const mapDispatchToProps = (dispatch) => ({
  setBillsTableState: (queries) => dispatch(setBillsTableState(queries)),
  resetBillsTableState: () => dispatch(resetBillsTableState()),
  setBillsSelectedRows: (selectedRows) =>
    dispatch(setBillsSelectedRows(selectedRows)),
});

export const withBillsActions = connect(null, mapDispatchToProps);
