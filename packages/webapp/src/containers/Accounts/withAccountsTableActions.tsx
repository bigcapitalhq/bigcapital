// @ts-nocheck
import { connect } from 'react-redux';
import {
  setAccountsTableState,
  resetAccountsTableState,
  setAccountsSelectedRows,
} from '@/store/accounts/accounts.actions';

const mapActionsToProps = (dispatch) => ({
  setAccountsTableState: (queries) => dispatch(setAccountsTableState(queries)),
  resetAccountsTableState: () => dispatch(resetAccountsTableState()),
  setAccountsSelectedRows: (selectedRows) =>
    dispatch(setAccountsSelectedRows(selectedRows)),
});

export const withAccountsTableActions = connect(null, mapActionsToProps);
