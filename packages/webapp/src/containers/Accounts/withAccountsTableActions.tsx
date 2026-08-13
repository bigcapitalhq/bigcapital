import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setAccountsTableState,
  resetAccountsTableState,
  setAccountsSelectedRows,
  resetAccountsSelectedRows,
} from '@/store/accounts/accounts.actions';

export interface WithAccountsTableActionsProps {
  setAccountsTableState: (queries: Partial<TableQuery>) => void;
  resetAccountsTableState: () => void;
  setAccountsSelectedRows: (selectedRows: Array<unknown>) => void;
  resetAccountsSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithAccountsTableActionsProps => ({
  setAccountsTableState: (queries) => dispatch(setAccountsTableState(queries)),
  resetAccountsTableState: () => dispatch(resetAccountsTableState()),
  setAccountsSelectedRows: (selectedRows) =>
    dispatch(setAccountsSelectedRows(selectedRows)),
  resetAccountsSelectedRows: () => dispatch(resetAccountsSelectedRows()),
});

export const withAccountsTableActions = connect(null, mapDispatchToProps);
