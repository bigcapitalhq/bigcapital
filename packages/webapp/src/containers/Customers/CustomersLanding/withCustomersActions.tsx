import { ComponentType } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import type { TableQuery } from '@/store/store.types';
import {
  setCustomersTableState,
  resetCustomersTableState,
  setCustomersSelectedRows,
  resetCustomersSelectedRows,
} from '@/store/customers/customers.actions';

export interface WithCustomersActionsProps {
  setCustomersTableState: (state: Partial<TableQuery>) => void;
  resetCustomersTableState: () => void;
  setCustomersSelectedRows: (selectedRows: Array<unknown>) => void;
  resetCustomersSelectedRows: () => void;
}

export const mapDispatchToProps = (
  dispatch: Dispatch,
): WithCustomersActionsProps => ({
  setCustomersTableState: (state) => dispatch(setCustomersTableState(state)),
  resetCustomersTableState: () => dispatch(resetCustomersTableState()),
  setCustomersSelectedRows: (selectedRows) =>
    dispatch(setCustomersSelectedRows(selectedRows)),
  resetCustomersSelectedRows: () => dispatch(resetCustomersSelectedRows()),
});

export function withCustomersActions<P>(
  WrappedComponent: ComponentType<P>,
): ComponentType<Omit<P, keyof WithCustomersActionsProps>> {
  const Connected = connect(
    null,
    mapDispatchToProps,
  )(WrappedComponent as ComponentType<any>);
  return Connected as unknown as ComponentType<
    Omit<P, keyof WithCustomersActionsProps>
  >;
}
