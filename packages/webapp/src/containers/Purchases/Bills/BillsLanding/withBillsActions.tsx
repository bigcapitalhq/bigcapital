import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import type { RootState } from '@/store/reducers';
import type { TableQuery } from '@/store/store.types';
import {
  setBillsTableState,
  resetBillsTableState,
  setBillsSelectedRows,
} from '@/store/bills/bills.actions';

export interface WithBillsActionsProps {
  setBillsTableState: (queries: Partial<TableQuery>) => void;
  resetBillsTableState: () => void;
  setBillsSelectedRows: (selectedRows: Array<unknown>) => void;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithBillsActionsProps => ({
  setBillsTableState: (queries) => dispatch(setBillsTableState(queries)),
  resetBillsTableState: () => dispatch(resetBillsTableState()),
  setBillsSelectedRows: (selectedRows) =>
    dispatch(setBillsSelectedRows(selectedRows)),
});

export const withBillsActions = connect(null, mapDispatchToProps);
