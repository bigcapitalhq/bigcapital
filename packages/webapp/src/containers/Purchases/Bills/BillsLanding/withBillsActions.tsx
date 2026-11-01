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
  resetBillsSelectedRows,
} from '@/store/bills/bills.actions';

export interface WithBillsActionsProps {
  setBillsTableState: (queries: Partial<TableQuery>) => void;
  resetBillsTableState: () => void;
  setBillsSelectedRows: (selectedRows: Array<unknown>) => void;
  resetBillsSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, unknown, AnyAction>,
): WithBillsActionsProps => ({
  setBillsTableState: (queries) => dispatch(setBillsTableState(queries)),
  resetBillsTableState: () => dispatch(resetBillsTableState()),
  setBillsSelectedRows: (selectedRows) =>
    dispatch(setBillsSelectedRows(selectedRows)),
  resetBillsSelectedRows: () => dispatch(resetBillsSelectedRows()),
});

export function withBillsActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithBillsActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithBillsActionsProps>
  >;
}
